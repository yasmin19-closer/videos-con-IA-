"""Quita los silencios largos (>0,3 s) dejando 0,1 s de aire y limpia la voz.
Genera public/cut.mp4 y src/data/words.json con los tiempos de cada palabra ya recortados."""
import json, subprocess, sys

SRC = "public/original.mp4"
# Tramos que se conservan (segundos del original). Pausas medidas por volumen (< -35 dB):
# 0,00-0,30 inicio, 4,96-5,38, 14,30-14,71 y 29,86-final. Se dejan 0,05 s a cada lado = 0,1 s de aire.
KEEP = [(0.25, 5.01), (5.33, 14.35), (14.66, 29.96)]
FADE = 0.01  # micro-fundido en cada corte para que no suene ningún "clic"

v, a, labels = [], [], []
for i, (s, e) in enumerate(KEEP):
    v.append(f"[0:v]trim={s}:{e},setpts=PTS-STARTPTS[v{i}]")
    a.append(f"[0:a]atrim={s}:{e},asetpts=PTS-STARTPTS,afade=t=in:d={FADE},afade=t=out:st={e - s - FADE}:d={FADE}[a{i}]")
    labels.append(f"[v{i}][a{i}]")
graph = ";".join(v + a) + ";" + "".join(labels) + f"concat=n={len(KEEP)}:v=1:a=1[v][araw];" \
    "[araw]highpass=f=85,acompressor=threshold=-20dB:ratio=2.5:attack=10:release=150:makeup=2[a]"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", SRC, "-filter_complex", graph, "-map", "[v]", "-map", "[a]",
                "-r", "30", "-c:v", "libx264", "-crf", "14", "-preset", "slow", "-pix_fmt", "yuv420p",
                "-c:a", "aac", "-b:a", "256k", "-ar", "48000", "public/cut.mp4"], check=True)

def remap(t):
    """Pasa un tiempo del original al vídeo recortado (si cae en un hueco, lo pega al borde)."""
    off = 0.0
    for s, e in KEEP:
        if t < s:
            return off
        if t <= e:
            return off + t - s
        off += e - s
    return off

words = json.load(open(sys.argv[1]))
out = [{"text": w["text"], "start": round(remap(w["start"]), 3), "end": round(remap(w["end"]), 3)} for w in words]
json.dump(out, open("src/data/words.json", "w"), ensure_ascii=False, indent=1)
print("duración final:", round(sum(e - s for s, e in KEEP), 2), "s")
