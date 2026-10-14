# Videos con IA

Herramientas para planear, escribir y revisar reels de Instagram antes de grabar.
Todo es Python 3 sin dependencias. Funciona en español e inglés.

**Empieza por `templates/voice.md`**: tu perfil de voz. Las skills lo leen antes
de escribir nada.

```
skills/ig-reel/hooks.json          26 fórmulas de hook: plantilla, ejemplo, texto en pantalla,
                                   para qué sirve, cómo se arruina y un regex para reconocerla
skills/ig-reel/hookscore.py        el panel de cinco propiedades del hook
skills/ig-reel/beats.py            del guion a una hoja de beats con tiempos
skills/ig-caption/caption.py       la vista previa del corte y el revisor del caption
skills/ig-human/slop.json          el léxico: 154 términos, 18 clases invisibles, 16 tics
skills/ig-human/humanize.py        las tres pasadas de limpieza
skills/ig-human/detect.py          el panel de cinco revisiones
skills/ig-viral/swipe.py           ranking de outliers y clasificación por fórmula
skills/ig-profile/rubric.json      la puntuación del perfil sobre 100
templates/voice.md                 tu perfil de voz. Rellénalo primero.
```

## Comandos

```
python3 skills/ig-reel/hookscore.py hooks.txt              # ordena tus hooks
python3 skills/ig-reel/beats.py guion.txt --target 30      # mídelo antes de grabar
python3 skills/ig-caption/caption.py caption.txt --terms "cierre de ventas"
python3 skills/ig-human/humanize.py borrador.txt --report  # límpialo, ve cada cambio
python3 skills/ig-human/detect.py borrador.txt             # puntúalo, cinco revisiones
python3 skills/ig-human/detect.py antes.txt despues.txt    # demuestra la diferencia
python3 skills/ig-viral/swipe.py skills/ig-viral/reels.csv # qué reels rompieron su media
python3 skills/ig-viral/swipe.py --patterns                # las 26 fórmulas
```

## Videos

Cada video vive en `videos/NN-nombre/` con `hooks.txt`, `guion.txt` y `caption.txt`.
