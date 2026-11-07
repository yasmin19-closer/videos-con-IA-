# Diseño de sonido: "video de objecion" y "video objecion 2"

Supuestos, ya que el prompt llegó con los campos sin rellenar: los dos MP4 del repositorio, reel vertical, estilo
**sutil y limpio**, uso comercial (solo CC0, o efectos generados), objetivo −14 LUFS y −1 dBTP, entrega en
`sound-design/`.

## Punto de partida
- Ambos vídeos son de 478×850 a unos 30 fps (V1 tiene frame rate variable; se usaron los tiempos reales de cada
  fotograma). Son a cámara fija, con una sola persona hablando y **solo voz**: no hay música ni efectos incrustados.
  El original suena a −23.7 LUFS.
- No hay stems. La mezcla estéreo se trató como pista de voz. Sin música, el paso de música del prompt no aplica.
- Las únicas acciones visibles con función sonora son los **zooms**. Los gestos con las manos son decorativos y se
  omitieron a propósito. Los "bursts" que la detección automática marca en 10.00 s y 20.00 s de ambos vídeos son
  artefactos de keyframe, no acciones.

## Cues
| id | t (s) | acción | sonido |
|---|---|---|---|
| V1-C01 | 0.285 | zoom-out de apertura | whoosh corto suave, bajo la primera palabra |
| V1-C02 | 32.936 | push-in final, en una pausa | whoosh suave oscuro |
| V2-C01 | 0.757 | zoom de rebote de apertura | whoosh corto suave, bajo la voz |
| V2-C02 | 28.091 | punch-in final | whoosh suave oscuro |
| V2-C03 | 28.357 | llegada del plano cercano | impacto suave (knock) |

Los detalles (fotograma, ancla, archivo, ganancia y fuente) están en `hoja_de_cues.csv` y `hoja_de_cues.json`.

## Medidas finales (MP4 ya codificado en AAC)
| | integrado | pico real | LRA | duración | vídeo |
|---|---|---|---|---|---|
| V1 | **−14.0 LUFS** | **−1.6 dBTP** | 4.7 LU | 33.735 s (igual) | stream idéntico al original, verificado por framemd5 |
| V2 | **−14.1 LUFS** | **−1.6 dBTP** | 3.7 LU | 29.190 s (igual) | stream idéntico al original, verificado por framemd5 |

- En mono, la mezcla pierde lo mismo que el original (+0.1 LU como máximo). Ningún efecto se cancela en mono.
- Voz: paso alto a 80 Hz, compresión suave 2.5:1 y +9.8 dB en el master, con un limitador que actúa poco.
- Los efectos quedan entre 4 y 8 dB por debajo de la voz: los whooshes bajo la voz están a unos −23 LUFS
  momentáneos y la voz a −14.6. Además, el ducking `voice-safe light` va guiado por el stem de voz.
- Ningún efecto queda a menos de 3 dB de la voz (eje `speech` = 10 en ambos vídeos).

## Qué es generado
**Todos los efectos (5 de 5) son generados con Earshot.** Las grabaciones CC0 encontradas en Openverse están en
Freesound, que devuelve 403 a las descargas desde este entorno. Las candidatas verificadas están en
`fuentes/openverse_candidatos.json`. Si las descargas tú, se pueden sustituir cambiando el `file` de cada cue en
`work/v*_cues_realsfx.json` y volviendo a ejecutar `mix.py`.

## Avisos de la autocrítica de Real SFX (son límites de la métrica, no del sonido)
- `pacing` (V1 5.2, V2 2.1): el vídeo es una persona hablando a cámara. La voz llena el tiempo y no hay más acciones
  visibles. Añadir sonidos solo para subir esta cifra iría contra el estilo sutil.
- `balance` en V2 (3.0): V2-C02 y V2-C03 caen en el silencio de 28.13–28.78 s, así que la métrica los compara con
  el silencio. Comparados con la voz, quedan unos 4 dB por debajo.
- `sync` aparece como n/a: lo comprobé fotograma a fotograma en `revision/v2_zoom28.png`.

## Momentos para escuchar (auriculares y altavoz de teléfono)
Los cortes están en `escucha/v1_escucha.wav` y `escucha/v2_escucha.wav`. Nadie ha escuchado todavía esta mezcla:
todo lo anterior son medidas.
1. **V1 0.0–0.6 s**: ¿el whoosh de apertura se oye sin tapar el inicio de la primera palabra?
2. **V1 32.5–33.4 s**: ¿el whoosh del push-in termina antes de que vuelva la voz (33.28 s)?
3. **V2 0.5–0.9 s**: el whoosh cae en plena frase. ¿Molesta, o conviene bajarlo o quitarlo?
4. **V2 27.8–28.5 s**: ¿el whoosh pisa la última sílaba (fin de la voz en 28.13 s)? ¿El knock se oye en el altavoz
   del teléfono?
5. **Carácter general**: ¿los efectos suenan sintéticos frente a la voz grabada? Si es así, sustitúyelos por las
   grabaciones CC0 candidatas.

## Archivos
- `v1_video_de_objecion_mezcla_final.mp4`, `v2_video_objecion_2_mezcla_final.mp4`: masters finales.
- `v1_sfx_aislado.wav`, `v2_sfx_aislado.wav`: solo los efectos, al nivel que tienen en la mezcla. Empiezan en 00:00 y
  duran exactamente lo mismo que el vídeo (48 kHz, 24 bits).
- `stems/v*_voz_voice.wav`: la voz editada, antes de la ganancia del master.
- `hoja_de_cues.csv` / `.json`, `creditos_y_licencias.md`.
- `fuentes/generadas/`: los efectos y sus recetas. `fuentes/openverse_candidatos.json`: las candidatas CC0.
- `revision/`: imágenes de revisión y críticas. `work/`: hojas de Real SFX para volver a renderizar.
