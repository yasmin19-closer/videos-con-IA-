"""Corta silencios y muletillas de un video y genera los subtítulos para Remotion.
Uso: python cut.py <video.mp4> <carpeta remotion> [--pausa 0.35] [--quitar palabra ...] [--quitar-tramo 1.2-3.4 ...] [--sin-cortes]
Deja: <remotion>/public/cut.mp4, <remotion>/src/words.ts y transcripcion.txt (para leer el texto con tiempos)."""
import argparse
import json
import os
import subprocess
import sys
import tempfile

sys.path.insert(0, os.path.dirname(__file__))
from fixes import fix_words  # noqa: E402
from transcribe import transcribe  # noqa: E402

FILLERS = {"eh", "ehm", "em", "mmm", "mm", "ah", "eeh"}
PAD = 0.12  # aire que se deja antes y después de cada tramo hablado


def run(cmd):
    subprocess.run(cmd, check=True)


def duration(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
                         capture_output=True, text=True, check=True).stdout
    return float(out.strip())


def keep_ranges(words, total, pause, quitar=(), tramos=()):
    """Tramos a conservar: se unen palabras separadas por menos de `pause` segundos."""
    drop = FILLERS | {q.lower() for q in quitar}
    spoken = [w for w in words if w["w"].lower().strip(".,;:?!¿¡") not in drop
              and not any(a <= w["s"] < b for a, b in tramos)]
    ranges = []
    for w in spoken:
        a, b = max(0, w["s"] - PAD), min(total, w["e"] + PAD)
        if ranges and a - ranges[-1][1] < pause:
            ranges[-1][1] = max(ranges[-1][1], b)
        else:
            ranges.append([a, b])
    return [(round(a, 3), round(b, 3)) for a, b in ranges], spoken


def retime(words, ranges):
    out, off = [], 0.0
    for a, b in ranges:
        for w in words:
            if a <= w["s"] < b:
                out.append({"w": w["w"], "s": round(off + w["s"] - a, 3), "e": round(off + min(w["e"], b) - a, 3)})
        off += b - a
    return out, off


def cut_video(src, ranges, dst):
    parts = "".join(
        f"[0:v]trim={a}:{b},setpts=PTS-STARTPTS[v{i}];[0:a]atrim={a}:{b},asetpts=PTS-STARTPTS[a{i}];"
        for i, (a, b) in enumerate(ranges))
    cat = "".join(f"[v{i}][a{i}]" for i in range(len(ranges)))
    fc = parts + f"{cat}concat=n={len(ranges)}:v=1:a=1[v][a];[v]fps=30,scale=trunc(iw/2)*2:trunc(ih/2)*2[vo]"
    run(["ffmpeg", "-v", "error", "-y", "-i", src, "-filter_complex", fc, "-map", "[vo]", "-map", "[a]",
         "-c:v", "libx264", "-crf", "16", "-preset", "fast", "-pix_fmt", "yuv420p",
         "-c:a", "aac", "-b:a", "192k", "-ar", "48000", dst])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video"); ap.add_argument("remotion")
    ap.add_argument("--pausa", type=float, default=0.35, help="pausas más largas que esto se cortan")
    ap.add_argument("--quitar", nargs="+", default=[], help="palabras a borrar del video (ej. --quitar ojalá)")
    ap.add_argument("--quitar-tramo", nargs="+", default=[], metavar="INICIO-FIN",
                    help="borra lo que se dice entre esos segundos del video original (ej. 29.4-30.05)")
    ap.add_argument("--sin-cortes", action="store_true", help="solo transcribir, sin cortar silencios")
    a = ap.parse_args()

    total = duration(a.video)
    with tempfile.TemporaryDirectory() as tmp:
        wav = os.path.join(tmp, "a.wav")
        run(["ffmpeg", "-v", "error", "-y", "-i", a.video, "-ac", "1", "-ar", "16000", wav])
        print("Transcribiendo...")
        words = fix_words(transcribe(wav))

    tramos = [tuple(float(x) for x in t.split("-")) for t in a.quitar_tramo]
    ranges, spoken = keep_ranges(words, total, a.pausa, a.quitar, tramos)
    if a.sin_cortes:
        ranges = [(0.0, round(total, 3))]
    new_words, dur = retime(spoken if not a.sin_cortes else words, ranges)

    os.makedirs(os.path.join(a.remotion, "public"), exist_ok=True)
    print(f"Cortando: {total:.1f}s → {dur:.1f}s ({len(ranges)} tramos)")
    cut_video(a.video, ranges, os.path.join(a.remotion, "public", "cut.mp4"))
    dur = duration(os.path.join(a.remotion, "public", "cut.mp4"))

    with open(os.path.join(a.remotion, "src", "words.ts"), "w", encoding="utf-8") as f:
        f.write("// Este archivo lo genera scripts/cut.py: no se edita a mano.\n")
        f.write('export const VIDEO = "cut.mp4";\n')
        f.write(f"export const DURATION = {dur:.3f};\n")
        f.write("export const WORDS: { w: string; s: number; e: number }[] = ")
        f.write(json.dumps(new_words, ensure_ascii=False) + ";\n")

    # texto legible con tiempos, para decidir dónde poner cada escena en video.tsx
    lines, cur = [], []
    for w in new_words:
        cur.append(w)
        if w["w"][-1:] in ".?!" or len(cur) >= 12:
            lines.append(f"[{cur[0]['s']:6.2f}] " + " ".join(f"{x['w']}({x['s']:.2f})" for x in cur)); cur = []
    if cur:
        lines.append(f"[{cur[0]['s']:6.2f}] " + " ".join(f"{x['w']}({x['s']:.2f})" for x in cur))
    with open(os.path.join(a.remotion, "..", "transcripcion.txt"), "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    print("Listo. Texto con tiempos en transcripcion.txt")


if __name__ == "__main__":
    main()
