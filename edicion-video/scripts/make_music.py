"""Música lo-fi instrumental (~95 BPM) generada por código, sin derechos de autor.
Uso: python make_music.py <salida.wav> [segundos=60] [bpm=95]"""
import sys
import wave

import numpy as np

SR = 48000
rng = np.random.default_rng(3)


def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


def lowpass(x, cutoff):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / (1 + (f / cutoff) ** 4)
    return np.fft.irfft(X, len(x))


def main():
    out = sys.argv[1]; dur = float(sys.argv[2]) if len(sys.argv) > 2 else 60; bpm = float(sys.argv[3]) if len(sys.argv) > 3 else 95
    b = 60 / bpm; n = int(SR * (dur + 2)); L = np.zeros(n); R = np.zeros(n)

    def add(sig, at, g=1.0, pan=0.0):
        s = int(at * SR); e = min(n, s + len(sig))
        if s >= n:
            return
        L[s:e] += sig[: e - s] * g * (1 - pan); R[s:e] += sig[: e - s] * g * (1 + pan)

    # acordes estilo jazz suave: Dm9 - G13 - Cmaj9 - Am9 (un compás cada uno)
    chords = [[50, 53, 57, 60, 64], [43, 53, 57, 59, 64], [48, 52, 55, 59, 62], [45, 48, 52, 55, 59]]
    bars = int(dur / (4 * b)) + 2
    for k in range(bars):
        st = k * 4 * b; ch = chords[k % 4]; ln = 4 * b + 0.3; tt = np.arange(int(ln * SR)) / SR
        keys = sum(np.sin(2 * np.pi * hz(m + 12) * tt) * (1 + 0.15 * np.sin(2 * np.pi * 4.5 * tt)) for m in ch[1:])
        keys *= np.exp(-tt * 0.9) * np.minimum(1, tt / 0.02)
        add(keys, st, 0.05, -0.2); add(keys, st + 2 * b, 0.03, 0.2)
        bass = np.sin(2 * np.pi * hz(ch[0] - 12) * tt[: int(1.8 * b * SR)])
        bass *= np.exp(-np.arange(len(bass)) / SR * 1.5)
        add(bass, st, 0.22); add(bass, st + 2.5 * b, 0.15)
        for beat in range(4):
            bt = st + beat * b
            kt = np.arange(int(0.35 * SR)) / SR
            if beat in (0, 2):
                kick = np.sin(2 * np.pi * np.cumsum(55 + 90 * np.exp(-kt * 30)) / SR) * np.exp(-kt * 9)
                add(kick, bt, 0.45)
            if beat in (1, 3):
                sn = lowpass(rng.standard_normal(len(kt)), 3500) * np.exp(-kt * 18)
                add(sn, bt + 0.015, 0.18)
            for h in (0, 0.5):
                ht = np.arange(int(0.05 * SR)) / SR
                hat = np.diff(rng.standard_normal(len(ht) + 1)) * np.exp(-ht * 90)
                add(hat, bt + h * b + (0.03 if h else 0), 0.035, 0.3)

    crackle = (rng.random(n) > 0.9993) * rng.standard_normal(n) * 0.15 + rng.standard_normal(n) * 0.003
    L += crackle; R += crackle
    L = lowpass(L, 5000); R = lowpass(R, 5000)
    m = int(dur * SR); x = np.stack([L[:m], R[:m]], 1)
    fade = int(1.5 * SR); x[:fade] *= np.linspace(0, 1, fade)[:, None]; x[-fade:] *= np.linspace(1, 0, fade)[:, None]
    x = x / np.abs(x).max() * 0.85
    with wave.open(out, "wb") as f:
        f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR)
        f.writeframes((x * 32767).astype(np.int16).tobytes())
    print("Música lista:", out)


if __name__ == "__main__":
    main()
