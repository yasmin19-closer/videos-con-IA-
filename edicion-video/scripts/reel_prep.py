"""Prepara un video nuevo: crea trabajos/edicion-<nombre>/ con una copia de la plantilla de Remotion,
corta silencios y genera los subtítulos.
Uso: python reel_prep.py "<video.mp4>" [nombre] [--pausa 0.35] [--sin-cortes]
Después: edita trabajos/edicion-<nombre>/remotion/src/video.tsx y renderiza con render.sh."""
import os
import re
import shutil
import subprocess
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    video = os.path.abspath(sys.argv[1])
    rest = sys.argv[2:]
    name = rest.pop(0) if rest and not rest[0].startswith("--") else os.path.splitext(os.path.basename(video))[0]
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    work = os.path.join(ROOT, "trabajos", f"edicion-{slug}")
    rem = os.path.join(work, "remotion")
    if os.path.exists(rem):
        print(f"Ya existe {work}: solo se vuelve a cortar el video (tu video.tsx no se toca).")
    else:
        shutil.copytree(os.path.join(ROOT, "remotion"), rem,
                        ignore=shutil.ignore_patterns("node_modules", "out", "cut.mp4"))
    shutil.copy(video, os.path.join(work, "original" + os.path.splitext(video)[1]))
    subprocess.run([sys.executable, os.path.join(ROOT, "scripts", "cut.py"), video, rem, *rest], check=True)
    print(f"\nCarpeta lista: {work}")
    print("1) Lee transcripcion.txt y edita remotion/src/video.tsx")
    print(f'2) Vista previa:  cd "{rem}" y luego: npx remotion studio src/index.ts')
    print(f'3) Render final: bash scripts/render.sh "{work}" "{work}/final.mp4" [musica.wav]')


if __name__ == "__main__":
    main()
