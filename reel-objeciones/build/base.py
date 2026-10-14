"""Monta la pantalla partida base (izquierda = blusa naranja, derecha = chaleco).

Habla un lado por turno; el otro queda congelado en un fotograma neutro.
Escribe assets/base.mp4 y assets/turnos.json con los tiempos de cada turno.
"""
import json, subprocess, sys
from pathlib import Path

BUENO, MALO, SALIDA = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])
TMP = SALIDA / "work"
TMP.mkdir(parents=True, exist_ok=True)

# Encuadre de cada lado en una mitad de 540x1920. El chaleco está más lejos: se acerca un poco.
VF = {
    "izq": "scale=-2:1920:flags=lanczos,crop=540:1920:225:0,unsharp=5:5:0.7",
    "der": "scale=-2:2200:flags=lanczos,crop=540:1920:250:190,unsharp=5:5:0.7",
}
FUENTE = {"izq": BUENO, "der": MALO}
CONGELADO = {"izq": 16.4, "der": 20.4}  # momentos con la boca cerrada

# (lado, inicio, fin) de la voz, medidos con silencedetect.
TURNOS = [
    ("izq", 2.10, 4.40), ("der", 6.60, 8.66),
    ("izq", 6.26, 8.33), ("der", 10.60, 12.01),
    ("izq", 9.52, 11.83), ("der", 13.58, 15.57),
    ("izq", 13.32, 15.76), ("der", 18.01, 19.45),
    ("izq", 17.20, 18.55), ("der", 21.36, 22.40),
    ("izq", 20.04, 22.44), ("der", 23.95, 26.55),
    ("izq", 23.50, 25.75), ("der", 27.83, 29.76),
]
ANTES, DESPUES = 0.15, 0.25

def run(args):
    subprocess.run(["ffmpeg", "-v", "error", "-y", *args], check=True)

for lado in ("izq", "der"):
    run(["-ss", str(CONGELADO[lado]), "-i", str(FUENTE[lado]), "-frames:v", "1",
         "-vf", VF[lado], str(TMP / f"quieto_{lado}.png")])

partes, tiempos, t = [], [], 0.0
for i, (lado, ini, fin) in enumerate(TURNOS):
    a, dur = ini - ANTES, (fin - ini) + ANTES + DESPUES
    otro = "der" if lado == "izq" else "izq"
    activo = f"[0:v]trim={a}:{a + dur},setpts=PTS-STARTPTS,{VF[lado]},fps=30[act]"
    quieto = f"[1:v]loop=-1:1,trim=0:{dur},setpts=PTS-STARTPTS,fps=30[qt]"
    orden = "[act][qt]" if lado == "izq" else "[qt][act]"
    filtro = (f"{activo};{quieto};{orden}hstack=2,format=yuv420p[v];"
              f"[0:a]atrim={a}:{a + dur},asetpts=PTS-STARTPTS,aresample=48000,"
              f"afade=t=in:d=0.04,afade=t=out:st={dur - 0.06}:d=0.06[a]")
    parte = TMP / f"turno_{i:02d}.mp4"
    run(["-i", str(FUENTE[lado]), "-loop", "1", "-i", str(TMP / f"quieto_{otro}.png"),
         "-filter_complex", filtro, "-map", "[v]", "-map", "[a]", "-t", f"{dur:.3f}",
         "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-c:a", "aac", "-b:a", "192k",
         "-ac", "2", str(parte)])
    partes.append(parte)
    tiempos.append({"turno": i + 1, "lado": lado, "inicio": round(t, 3),
                    "voz": round(t + ANTES, 3), "fin": round(t + dur, 3)})
    t += dur

(TMP / "lista.txt").write_text("".join(f"file '{p.name}'\n" for p in partes))
run(["-f", "concat", "-safe", "0", "-i", str(TMP / "lista.txt"), "-c", "copy",
     str(SALIDA / "base.mp4")])
(SALIDA / "turnos.json").write_text(json.dumps(tiempos, indent=1))
print(f"duración total: {t:.2f} s")
