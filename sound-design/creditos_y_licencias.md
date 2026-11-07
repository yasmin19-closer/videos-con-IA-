# Créditos y licencias

## Sonidos usados en la mezcla

Los 5 efectos de esta entrega son **generados por código** con
[Earshot](https://github.com/Leonxlnx/earshot) v0.4.1 (Leon Lin, licencia MIT) mediante `earshot sfx render`.
No contienen grabaciones de terceros. La receta exacta de cada uno (id del banco, semilla, duración y apex) está en
el `.json` que acompaña a cada `.wav` en `fuentes/generadas/`.

| archivo | receta Earshot | cue |
|---|---|---|
| v1_c01_swipe_velvet.wav | `swipe/velvet --dur 0.6 --apex 0.25` (seed 968699985) | V1-C01 |
| v1_c02_whoosh_windy.wav | `pro_whoosh_big/windy --dur 0.8 --apex 0.5` (seed 23895038) | V1-C02 |
| v2_c01_swipe_velvet.wav | `swipe/velvet --dur 0.5 --apex 0.3` (seed 968699985) | V2-C01 |
| v2_c02_whoosh_windy.wav | `pro_whoosh_big/windy --dur 0.6 --apex 0.33` (seed 23895038) | V2-C02 |
| v2_c03_pop_knock.wav | `pro_pop_in/knock` (seed 399595374) | V2-C03 |

Para usarlos en un reel o un anuncio comercial no hace falta atribución. La licencia MIT cubre el código de Earshot. Los
sonidos se generan en este proyecto y no proceden de una grabación de terceros.

La mezcla, la colocación y la nivelación se hicieron con la skill **Real SFX** de Clipwing (v0.14.1,
https://clipwing.pro/skills/real-sfx).

## Grabaciones candidatas de Openverse (no usadas)

En `fuentes/openverse_candidatos.json` hay 9 grabaciones **CC0 1.0**, tres por tipo de cue. De cada una se guardan el
título, el autor, la ficha de origen, la URL del archivo y la URL de la licencia, todo verificado en la API de
Openverse. Todas están alojadas en Freesound. No se pudieron descargar, porque `cdn.freesound.org` responde
**403** a este entorno. Por eso tampoco se compararon ni se midieron. CC0 no exige atribución, pero si las usas,
conviene citar al autor como cortesía.

Descartes en la búsqueda:
- Los resultados de Wikimedia para "whoosh", "swoosh" y "thud" son casi todos pronunciaciones habladas
  (Lingua Libre). Se descartaron por contener voz.
- No se consideró ningún material NC ni ND. Los resultados CC BY y CC BY-SA quedaron fuera porque había candidatos CC0.

## Audio original

La voz pertenece a los vídeos `video de objecion.mp4` y `video objecion 2.mp4` del repositorio. Solo se procesó:
paso alto a 80 Hz, compresión 2.5:1 y ganancia del master.
