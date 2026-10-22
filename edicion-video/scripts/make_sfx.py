"""Genera los efectos de sonido (whoosh, pop, ding, click, boom) en remotion/public/sfx.
Solo hace falta correrlo una vez. Si tienes tus propios sonidos, reemplaza los .wav con el mismo nombre."""
import os
import wave

import numpy as np

SR = 48000
OUT = os.path.join(os.path.dirname(__file__), "..", "remotion", "public", "sfx")
rng = np.random.default_rng(7)


def t(d):
    return np.arange(int(SR * d)) / SR


def env(x, a, r):
    n = len(x); e = np.ones(n)
    na = max(1, int(a * SR)); e[:na] = np.linspace(0, 1, na)
    e[na:] = np.exp(-np.arange(n - na) / (r * SR))
    return x * e


def lowpass(x, k):
    return np.convolve(x, np.ones(k) / k, mode="same")


def whoosh():
    d = 0.55; n = rng.standard_normal(len(t(d)))
    out = np.zeros_like(n)
    for i, k in enumerate(np.linspace(40, 4, 8)):  # barrido de grave a agudo
        seg = slice(i * len(n) // 8, (i + 1) * len(n) // 8)
        out[seg] = lowpass(n, int(k))[seg]
    shape = np.sin(np.linspace(0, np.pi, len(n))) ** 2
    return out * shape * 2.2


def pop():
    x = t(0.12); f = 900 * np.exp(-x * 30) + 300
    return env(np.sin(2 * np.pi * np.cumsum(f) / SR), 0.002, 0.03)


def ding():
    x = t(1.2)
    s = sum(a * np.sin(2 * np.pi * f * x) for f, a in [(1318, 1), (2637, 0.35), (3951, 0.12)])
    return env(s, 0.003, 0.35) * 0.6


def click():
    x = t(0.04)
    return env(rng.standard_normal(len(x)) * 0.6 + np.sin(2 * np.pi * 2500 * x), 0.0005, 0.006)


def boom():
    x = t(1.0); f = 90 * np.exp(-x * 4) + 38
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.3 * lowpass(rng.standard_normal(len(x)), 60)
    return env(s, 0.004, 0.25)


def save(name, x):
    x = x / (np.abs(x).max() + 1e-9) * 0.89
    with wave.open(os.path.join(OUT, name + ".wav"), "wb") as f:
        f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR)
        f.writeframes((x * 32767).astype(np.int16).tobytes())


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for fn in (whoosh, pop, ding, click, boom):
        save(fn.__name__, fn())
    print("Sonidos listos en", os.path.abspath(OUT))
