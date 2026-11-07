"""Recorta a la persona del fondo y guarda un video con transparencia (WebM VP9 con alfa) para Remotion.
Usa el modelo de segmentación de la skill Effects, así que se ejecuta con su Python:
  ~/.claude/skills/effects/.venv/bin/python scripts/cutout.py <entrada.mp4> <salida.webm> [ancho=1080]
En Windows: $HOME\\.claude\\skills\\effects\\.venv\\Scripts\\python.exe scripts\\cutout.py ...
"""
import os
import subprocess
import sys

import cv2
import mediapipe as mp
import numpy as np
from mediapipe.tasks.python import vision
from mediapipe.tasks.python.core.base_options import BaseOptions

MODEL = os.path.expanduser(os.path.join("~", ".claude", "skills", "effects", "models", "selfie_segmenter.tflite"))


def probe(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height",
                          "-of", "csv=p=0", path], capture_output=True, text=True, check=True).stdout
    w, h = out.strip().split(",")[:2]
    return int(w), int(h)


def guided(I, p, r=8, eps=2e-3):
    """Afina el borde de la máscara siguiendo los bordes reales de la imagen (pelo, hombros)."""
    box = lambda x: cv2.boxFilter(x, -1, (2 * r + 1, 2 * r + 1))
    mI, mp_ = box(I), box(p)
    a = (box(I * p) - mI * mp_) / (box(I * I) - mI * mI + eps)
    b = mp_ - a * mI
    return np.clip(box(a) * I + box(b), 0, 1)


def main():
    src, dst = sys.argv[1], sys.argv[2]
    W = int(sys.argv[3]) if len(sys.argv) > 3 else 1080
    sw, sh = probe(src)
    H = int(round(W * sh / sw / 2) * 2)
    seg = vision.ImageSegmenter.create_from_options(vision.ImageSegmenterOptions(
        base_options=BaseOptions(model_asset_path=MODEL), running_mode=vision.RunningMode.VIDEO,
        output_confidence_masks=True, output_category_mask=False))
    rd = subprocess.Popen(["ffmpeg", "-v", "error", "-i", src, "-vf", f"fps=30,scale={W}:{H}:flags=bicubic,format=rgb24",
                           "-f", "rawvideo", "-"], stdout=subprocess.PIPE, bufsize=10 ** 8)
    wr = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgba", "-s", f"{W}x{H}", "-r", "30",
                           "-i", "-", "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "6M", "-auto-alt-ref", "0",
                           "-row-mt", "1", "-deadline", "realtime", "-cpu-used", "5", dst], stdin=subprocess.PIPE)
    n, prev, i = W * H * 3, None, 0
    while True:
        b = rd.stdout.read(n)
        if len(b) < n:
            break
        rgb = np.frombuffer(b, np.uint8).reshape(H, W, 3)
        img = mp.Image(image_format=mp.ImageFormat.SRGB, data=np.ascontiguousarray(rgb))
        m = seg.segment_for_video(img, int(i * 1000 / 30)).confidence_masks[-1].numpy_view().astype(np.float32)
        m = m.reshape(m.shape[0], m.shape[1])
        if m.shape != (H, W):
            m = cv2.resize(m, (W, H))
        m = guided(cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY).astype(np.float32) / 255, m)
        m = np.clip((m - 0.5) * 1.8 + 0.5, 0, 1)
        if prev is not None:
            m = 0.6 * m + 0.4 * prev  # suaviza el parpadeo entre fotogramas
        prev = m
        wr.stdin.write(np.dstack([rgb, (m * 255).astype(np.uint8)]).tobytes())
        i += 1
    wr.stdin.close()
    wr.wait()
    rd.wait()
    print(f"Listo: {dst} ({i} fotogramas, {W}x{H})")


if __name__ == "__main__":
    main()
