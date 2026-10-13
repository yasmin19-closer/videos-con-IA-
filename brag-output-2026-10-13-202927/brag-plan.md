# Brag Plan: videos con IA (vertical · polished · con voz)

## Qué es
Un estudio de motion graphics dentro de una carpeta: HyperFrames, Remotion y /brag instalados para que Claude haga videos a partir de un pedido en español, sin que quien lo pide programe.

## El ángulo
Una pieza de producto sobria y segura de sí misma. Va del pedido de una persona que no programa a un estudio que ya funciona y a un video terminado. No hay chistes: la sorpresa está en lo poco que hizo falta. La voz pone el contexto que no aparece escrito en pantalla.

## Hook (0–5.8 s)
Sobre un fondo oscuro, un único globo de chat donde se escribe el pedido real: "Prepárame un estudio de motion graphics. Yo no programo." Se queda quieto y respira.

## Momentos clave
- La terminal real de `hyperframes doctor`: las comprobaciones aparecen una a una (Node v22.22.0 ✓, FFmpeg 6.1.1 ✓, Chrome Headless Shell ✓) y cierran con "Ready to render."
- Tres tarjetas que llegan una a una: HyperFrames 10 · Remotion 12 · brag 2. Se funden en "24 skills de video".

## Remate
El primer video (`brag-output/brag.mp4`) se reproduce dentro de un marco de teléfono. Luego un fundido al nombre **videos con IA** con la línea "Pídelo en español." Después, silencio con la música apagándose.

## Flujo de uso que se muestra
Pedido en el chat → el estudio se instala y se comprueba → un video terminado.

## Tono
- Preset: `polished`
- Dirección: película de producto premium y tranquila, en vertical para redes.
- Interpretación: cuatro escenas con esperas largas y fundidos suaves de 0.6 a 0.8 s. Tipografía en mayúsculas y minúsculas, de peso medio y con aire. Una sola idea por escena.

## Formato: vertical, 1080×1920, 30 fps
## Duración: 23.0 s

## Identidad visual (del proyecto)
- Fondo: #0D0E12 · Texto: #F4F1EA · Acento: coral #FF5B2E · Secundario: violeta #8B6CFF · Verde de terminal: #6EE7A0
- Tipografía principal: Inter Display Medium/Bold (hay pocas palabras en Black) · Mono: DejaVu Sans Mono
- Elemento visual más fuerte: el globo de chat con el pedido real y la terminal del doctor en verde.
- Zona segura vertical: el texto clave va entre el 20 % y el 75 % de la altura, lejos de los botones de Reels y TikTok.

## Guion de voz (Kokoro · `ef_dora`, español)
La voz no lee nada de lo que está escrito en pantalla, solo añade lo que no se ve. Las duraciones se midieron con una generación de prueba real.

| Escena | Entra | Frase | Duración | Qué se ve mientras tanto |
|---|---|---|---|---|
| 1 | 0.6 s | "Todo empezó con un mensaje. Sin código y sin tutoriales." | 3.5 s | El pedido escribiéndose en el chat |
| 2 | 6.3 s | "Claude instaló el motor de video y el navegador que renderiza, y lo comprobó todo él solo." | 5.1 s | Las comprobaciones ✓ de la terminal |
| 3 | 13.0 s | "Ahora sabe animar, poner música y voz, y montar un lanzamiento como este." | 4.2 s | Las tarjetas 10 · 12 · 2 → 24 skills |
| 4 | 18.2 s | "Tú describes el video. Lo demás ya está listo." | 2.9 s | El primer video dentro del teléfono |

Voz total: unos 15.6 s. Termina hacia el segundo 21.1 y deja unos 2 s de logo con solo música, que es el silencio del cierre `polished`.
Nota: la voz por defecto de la skill (`af_heart`) es en inglés. Se usa `ef_dora`, la voz en español de Kokoro, con `--lang es`.

## Texto para publicar (borrador)
"Le dije a Claude «yo no programo». Ahora tengo un estudio de motion graphics que hace videos como este con un pedido en español."

## Dirección de audio
- Papel: base cálida y discreta bajo la voz.
- Música: `happy-beats-business-moves-vol-11` (114.8 BPM). Ducking a ~0.13 mientras habla la voz; vuelve a subir en el logo y se apaga al final.
- Guía de cues: preset leído. Los cues fuertes en 5.80 s, 12.65 s y 17.91 s marcan los tres cambios de escena, y el 22.65 s marca el asentamiento del logo. Para las tarjetas de la escena 3, una cada dos beats: ~13.18, 14.22, 15.28 s.
- Reacción al audio: sutil. Un brillo leve del acento coral que respira con la música en el logo, sin barras de onda.
- SFX: pocos y ligados al movimiento, como un tecleo suave en el chat, ticks bajos en cada ✓ y un roce de tarjeta en cada llegada.
- Contención: ningún efecto encima de la voz a más volumen que la voz; nada de whooshes en los fundidos.

## Storyboard

### Escena 1 — El pedido — 0.0–5.8 s (5.8 s)
Globo de chat centrado, con el pedido real escribiéndose: "Prepárame un estudio de motion graphics. Yo no programo." Se mantiene unos 2.5 s ya completo.
Secuencia: sí, el texto se escribe carácter a carácter.
Audio: calma, la música arranca baja y la voz entra en 0.6 s.
Idea acoplada al audio: tecleo suave bajo la escritura.
Transición: fundido suave → Escena 2, fijado al cue de 5.80 s.

### Escena 2 — El estudio se instala — 5.8–12.6 s (6.8 s)
Ventana de terminal con `npx hyperframes doctor`. Las tres comprobaciones aparecen una a una, con espera, y luego "Ready to render." en verde.
Secuencia: sí, 3 líneas ✓ a ~0.9 s de distancia y después el cierre.
Audio: preciso, sin prisa.
Idea acoplada al audio: un tick bajo por cada ✓ y una campanita suave en "Ready".
Transición: fundido suave → Escena 3, fijado al cue de 12.65 s.

### Escena 3 — Lo que sabe hacer — 12.6–17.9 s (5.3 s)
Tres tarjetas apiladas en vertical: HyperFrames · 10, Remotion · 12, brag · 2. Llegan una a una y luego se resumen en "24 skills de video", que se mantiene al menos 1.2 s.
Secuencia: sí, las tarjetas entran una cada dos beats y luego aparece el total.
Audio: un roce de tarjeta en cada llegada.
Transición: fundido suave → Escena 4, fijado al cue de 17.91 s.

### Escena 4 — El resultado y la firma — 17.9–23.0 s (5.1 s)
Marco de teléfono con fotogramas reales de `brag.mp4` reproduciéndose (17.9–21.2 s). Fundido al logo **videos con IA** con la línea "Pídelo en español." (21.2–23.0 s), que se asienta en el cue de 22.65 s.
Secuencia: no.
Audio: la voz cierra en 21.1 s y la música sube y se apaga sola.
Transición: fin, con fundido a negro en los últimos 0.4 s.

**Mood musical:** cálido, optimista y contenido.
**Resumen de audio:** música baja bajo una voz cercana, con pequeños ticks que subrayan cada cosa que aparece, y un cierre de logo donde solo queda la música apagándose.
