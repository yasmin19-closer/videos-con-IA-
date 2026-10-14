# Carpeta de hooks virales

12 patrones de hook que se repiten en los reels que rompen su propia media.
Cada uno trae por qué funciona, plantillas para rellenar y ejemplos para el
nicho de ventas y objeciones. Los números son fijos: `swipe.py` los usa para
clasificar cada reel (`#3 Nobody Tells You`, `#9 The Steal`...).

**Cómo usar esta carpeta**

1. Elige 2 o 3 patrones que encajen con la idea del video.
2. Rellena las plantillas con tu objeción y pásalas por
   `python3 hookscore.py`. Graba el que mejor puntúe y entre en 3 segundos.
3. Cuando veas un reel que explota en otra cuenta, anótalo en `reels.csv`
   (cuenta, vistas, vistas típicas de esa cuenta, primera frase) y corre
   `python3 swipe.py swipe/reels.csv`. Con el tiempo verás qué patrones
   rompen más en tu nicho, con datos reales y no con intuición.

Reglas que valen para todos: el hook se dice en 3 segundos o menos, nombra la
objeción con las palabras exactas del cliente (entre comillas en pantalla), y
nunca empieza con saludo, presentación ni "en este video".

---

## #1 Stop Doing

Prohíbe algo que el espectador probablemente hace. Duele un poco, y por eso
se quedan a ver qué hacer en su lugar.

- Deja de ___ cuando te dicen "___"
- No respondas "___"
- Nunca digas "___" en un cierre

> Deja de bajar el precio cuando te dicen "está caro"
> No respondas "ok, te escribo mañana"

## #2 The List

Un número promete algo concreto y con final. El espectador cuenta mientras
mira, y eso sube la retención.

- ___ frases para cerrar cuando dicen "___"
- ___ objeciones que escuchas cada semana
- ___ errores que te hacen perder la venta en el minuto 1

> 3 frases para cerrar cuando dicen "lo voy a pensar"
> 5 objeciones que escuchas cada semana

## #3 Nobody Tells You

Promete información que "deberían haberte dicho". Abre una brecha de
curiosidad y pone a quien habla del lado del espectador.

- Nadie te dice esto cuando empiezas en ___
- Nadie te enseña qué responder a "___"

> Nadie te dice esto cuando empiezas en ventas
> Nadie te enseña qué responder a "está caro"

## #4 The Loss

Una pérdida concreta (dinero, ventas, clientes) en primera persona. La
pérdida pesa más que la ganancia, y la cifra la hace creíble. Usa solo cifras
reales.

- Perdí ___ por una sola frase
- Perdí ___ seguidos por decir "___"

> Perdí una venta de $3,000 por una sola frase
> Perdí 10 cierres seguidos por decir "lo entiendo"

## #5 The Callout

Pregunta por una situación que el espectador vivió esta semana. Si la
respuesta es "sí", ya se quedó.

- ¿Te dijeron "___"? Pregunta esto
- ¿Te dicen "___"? No ___

> ¿Te dijeron "lo voy a pensar"? Pregunta esto
> ¿Te dicen "mándame información"? No la mandes

## #6 The Contrarian

Contradice lo que todos creen. Funciona si lo que sigue lo demuestra rápido.

- "___" casi nunca es por ___
- "___" no es por ___

> "Está caro" casi nunca es por el precio
> "Lo voy a pensar" no es por el tiempo

## #7 The Result

Muestra el final primero y promete el cómo. Con un número concreto rinde
mucho más; sin él, `hookscore` lo deja en OK.

- Así cerré ___ que ya estaba perdida
- Así recuperé ___
- Cómo pasé de ___ a ___ cierres al mes

> Así cerré una venta que ya estaba perdida
> Así recuperé a un cliente que me dejó en visto

## #8 The Script

Promete las palabras exactas para decir. Es el formato más guardable del
nicho: la gente vuelve a buscarlo antes de una llamada.

- Dile esto cuando el cliente diga "___"
- Cuando te digan "___", responde así

> Dile esto cuando el cliente diga "está caro"
> Cuando te digan "no tengo dinero", responde así

## #9 The Steal

Regala algo listo para copiar. "Róbate" suena a atajo y a algo valioso, y
dispara guardados y envíos.

- Róbate este guion para "___"
- Cópiate mis ___ preguntas de ___

> Róbate este guion para "lo voy a pensar"
> Cópiate mis 3 preguntas de cierre

## #10 If You

Filtra a la audiencia en la primera frase. Quien se reconoce se queda;
quien no, se va, y eso también ayuda al algoritmo a encontrar a los tuyos.

- Si te dicen "___", haz esto
- Si vendes por ___, deja de ___

> Si te dicen "lo hablo con mi pareja", haz esto
> Si vendes por WhatsApp, deja de hacer esto

## #11 Before / After

Un contraste entre dos momentos. El espectador quiere saber qué pasó en
medio. Usa solo números reales.

- Antes ___. Ahora ___
- Hace un año ___. Esto cambió

> Antes perdía 7 de 10 ventas. Ahora cierro 6
> Hace un año no cerraba nada. Esto cambió

## #12 The Confession

Admite algo incómodo. La vulnerabilidad baja la guardia y hace creíble lo
que viene después.

- La verdad: ___
- Confieso que ___

> La verdad: el cliente no te dice por qué no compra
> Confieso que perdí ventas por miedo a preguntar

---

## Lo que no funciona (y swipe.py deja como `unclassified`)

- Saludos: "Hola a todos", "Hey guys"
- Anuncios: "En este video te voy a mostrar..."
- Presentaciones: "Me llamo ___ y soy closer"
- Pedir atención: "Para de scrollear", "Espera, no pases"

Todos los ejemplos están en `hooks-virales.txt`, listos para
`python3 hookscore.py swipe/hooks-virales.txt`.
