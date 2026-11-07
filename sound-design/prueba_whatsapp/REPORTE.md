# Prueba: WhatsApp Video 2026-11-07 at 3.09.14 PM

Supuestos: reel vertical, estilo **sutil y limpio**, uso comercial (solo CC0 o efectos generados), objetivo −14 LUFS
y −1 dBTP.

## Punto de partida
- 480×854, 30 fps con frame rate variable (se usaron los tiempos reales de cada fotograma), 60.54 s, sin stems.
- Es una persona hablando a cámara, con cámara de móvil fija. El original suena a −19.9 LUFS con picos a +0.4 dBFS:
  hay muestras recortadas en 25.51 s y en el jingle final.
- **Hay un efecto ya incrustado**: un jingle tonal en 58.65–60.54 s (Do6, Sol6, La6, Do7) sobre la sonrisa final.
  Se conserva y no se le añade nada encima. Estaba unos 8 dB por encima de la voz y limitaba la sonoridad de todo el
  reel (−18.7 LUFS), así que lo bajé 12 dB antes de la compresión. Queda ligeramente por encima de la voz, como cierre.
- La única acción visible con función sonora es el **reencuadre de cámara al arrancar** (0.33–0.57 s). Los gestos
  con las manos (1.7–2.0 s, 8.7 s, 51.7–53.3 s) son decorativos y se omitieron. Las detecciones en 10/20/30/40/50 s
  son keyframes del códec, no acciones.

## Cues
| id | t (s) | acción | sonido |
|---|---|---|---|
| P-C01 | 0.367 | reencuadre de cámara al arrancar | whoosh corto y suave (generado), unos 10 dB por debajo de la voz |
| P-EXIST | 58.65 | jingle final ya incrustado | se conserva, bajado 12 dB |

## Procesado de la mezcla base
Sobre la mezcla original, porque no hay stems: paso alto a 80 Hz, bajada del jingle con una rampa de 150 ms,
compresión 3:1 (umbral −32 dB), limitador de picos y +11.2 dB en el master.

## Medidas finales (MP4 codificado)
- **−14.9 LUFS integrados, −1.0 dBTP de pico real**, LRA 2.9 LU.
- No llegué a −14 sin una limitación fuerte. Me quedé en −14.9 para no aplastar la voz.
- La duración es igual a la original (60.54 s) y el stream de vídeo es idéntico, verificado por framemd5.
- En mono pierde lo mismo que el original (1.1 LU). El whoosh no se cancela.
- La autocrítica de Real SFX da 10 en hook, headroom, loudness, balance, speech, low_end y mono. Da 1.0 en
  `pacing` porque solo hay un efecto en 60 s. Es lo que pide un vídeo hablado sin más acciones visibles.

## Qué es generado
El whoosh P-C01 está generado con Earshot (MIT; receta en `fuentes/generadas/p_c01_swipe_velvet.json`). Las
grabaciones CC0 de Openverse siguen sin poder descargarse desde este entorno, porque Freesound devuelve 403.
Las candidatas verificadas están en `../fuentes/openverse_candidatos.json`.

## Momentos para escuchar (auriculares y altavoz de teléfono)
1. **0.0–0.8 s**: ¿el whoosh suena a reencuadre o parece un ruido suelto antes de la primera palabra?
2. **11.4–11.6 s**: el codificador AAC provocó un exceso de pico ahí, y Real SFX lo corrigió con una bajada local de
   3.8 dB durante 120 ms. Comprueba que no se nota un hueco en la sílaba.
3. **25.5 s**: el original ya traía un recorte. ¿Se oye distorsión?
4. **58.4–60.5 s**: ¿el jingle queda bien a este nivel frente a la última frase? Trae recortes del original, que se
   reducen al bajarlo pero no desaparecen.
5. **En general**: con −14.9 LUFS y la compresión 3:1, ¿la voz sigue sonando natural?

## Archivos
- `prueba_whatsapp_mezcla_final.mp4`: el master.
- `prueba_whatsapp_sfx_aislado.wav`: solo los efectos, al nivel de la mezcla. Empieza en 00:00 y dura 60.542 s
  (48 kHz, 24 bits).
- `stems/p_voz_voice.wav`: la voz y el jingle editados.
- `hoja_de_cues.csv` / `.json`, `revision/` (crítica e imagen de sincronía), `escucha/p_escucha.wav`, `work/` (hojas
  de Real SFX).
- `original_whatsapp.mp4`: copia del vídeo recibido.
- Créditos y licencias: los mismos que en `../creditos_y_licencias.md` (el efecto es generado con Earshot, MIT, sin
  atribución obligatoria).
