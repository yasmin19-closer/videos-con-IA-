"""Campana sintética con el espectro medido en la referencia: 4.3 kHz + parciales 5.7 y 9.7 kHz, cola ~2.5 s."""
import sys, numpy as np, soundfile as sf
sr, dur = 48000, 2.6
t = np.arange(int(sr * dur)) / sr
y = (1.0 * np.sin(2*np.pi*4300*t) * np.exp(-t/0.80)
     + 0.45 * np.sin(2*np.pi*5700*t) * np.exp(-t/0.45)
     + 0.25 * np.sin(2*np.pi*9700*t) * np.exp(-t/0.20)
     + 0.30 * np.sin(2*np.pi*2150*t) * np.exp(-t/0.60))
ataque = np.minimum(t / 0.003, 1.0)
clic = np.random.default_rng(7).normal(0, 1, t.size) * np.exp(-t/0.004) * 0.35
y = (y * ataque + clic)
y = 0.5 * y / np.abs(y).max()
sf.write(sys.argv[1], np.stack([y, y], 1), sr)
