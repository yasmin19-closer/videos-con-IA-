# Edición de video

Herramientas para editar mis videos con Remotion + ffmpeg.

| Archivo | Para qué sirve |
|---|---|
| `remotion/src/video.tsx` | El único archivo que se edita por video: encuadres, palabras clave, efectos de sonido y escenas. El contenido actual es un ejemplo ("Sofía", 41 s). |
| `scripts/fixes.py` | Corrige nombres que Whisper transcribe mal (GoHighLevel, Claude, n8n...). Agrega aquí tus errores recurrentes. |
| `scripts/render.sh` | Render final: Remotion → música con ducking (opcional) → volumen normalizado a -14 LUFS. |

## Uso del render

```bash
scripts/render.sh <carpeta-edicion> "salida.mp4" [musica.wav] [volumen_musica=0.16]
```

Requiere `ffmpeg`, `ffprobe`, `node`/`npx` y `python3`.

## Pendiente

`video.tsx` importa `./theme` y `./lib`, y `fixes.py` lo usan `cut.py` y `reel_prep.py`.
Esos archivos todavía no están en el proyecto; hay que agregarlos para que todo funcione.
