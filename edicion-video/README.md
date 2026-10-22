# Edición de video

Convierte un video vertical grabado con el celular en un reel editado: quita los silencios, agrega subtítulos
animados, tarjetas, zooms y efectos de sonido, y deja el volumen listo para redes (-14 LUFS).

## Instalación en Windows (solo la primera vez)

1. Instala **Git** (trae "Git Bash", necesario para `render.sh`) en PowerShell:
   `winget install Git.Git`
2. Ya tienes ffmpeg. Instala Node y Python si faltan:
   `winget install OpenJS.NodeJS.LTS` y `winget install Python.Python.3.12`
3. Cierra y abre de nuevo la terminal. Dentro de la carpeta `edicion-video`:
   ```
   npm install
   pip install faster-whisper numpy
   python scripts/make_sfx.py
   ```
   La primera vez que transcribas, Whisper descarga su modelo (unos 500 MB).

## Hacer un video (3 pasos)

```
python scripts/reel_prep.py "C:\ruta\mi-video.mp4" mi-video
```
Crea `trabajos/edicion-mi-video/` con el video cortado, los subtítulos y `transcripcion.txt` (el texto con el segundo
exacto de cada palabra).

1. **Edita** `trabajos/edicion-mi-video/remotion/src/video.tsx` usando los tiempos de `transcripcion.txt`.
2. **Mira la vista previa:** entra en `trabajos/edicion-mi-video/remotion` y ejecuta `npx remotion studio src/index.ts`
3. **Renderiza** (en Git Bash):
   `bash scripts/render.sh trabajos/edicion-mi-video trabajos/edicion-mi-video/final.mp4 [musica.wav]`

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `remotion/src/video.tsx` | Plantilla de ejemplo (historia de "Sofía"). Cada video tiene su propia copia. |
| `remotion/src/lib.tsx` | Las piezas: cámara, tarjetas, filas, contadores, frases, subtítulos, sonidos. |
| `remotion/src/theme.ts` | Colores, tipografía y el texto de marca de arriba (`BRAND`). |
| `scripts/reel_prep.py` | Prepara un video nuevo (copia la plantilla y llama a `cut.py`). |
| `scripts/cut.py` | Transcribe, quita silencios y muletillas, genera `words.ts`. Opciones: `--pausa 0.5`, `--sin-cortes`. |
| `scripts/transcribe.py` | Transcripción con faster-whisper (modelo con `WHISPER_MODEL=small/medium`). |
| `scripts/fixes.py` | Corrige nombres que la transcripción escucha mal. Agrega aquí los tuyos. |
| `scripts/make_music.py` | Genera música lo-fi sin derechos: `python scripts/make_music.py musica.wav 60 95` |
| `ejemplos/` | Los video.tsx de videos ya hechos, para copiar ideas. |
| `scripts/make_sfx.py` | Genera los efectos whoosh, pop, ding, click y boom. |
| `scripts/render.sh` | Render final con música opcional (baja sola cuando hablas) y volumen normalizado. |
