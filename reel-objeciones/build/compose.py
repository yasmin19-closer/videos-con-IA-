"""Genera index.html y una sub-composición por bloque a partir de assets/turnos.json,
siguiendo docs/style-guide.md.

Pantalla partida 1080x1920 (Reel de Instagram). Todo el texto y los iconos quedan en la
franja central (y 980-1500), lejos de la barra superior y de los botones y el pie de Instagram.
"""
import json
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
turnos = json.loads((RAIZ / "assets/turnos.json").read_text())
FIN = turnos[-1]["fin"]
A = "../assets"  # rutas desde compositions/

BLOQUES = [  # (id, turnos que cubre, cabecera izquierda, cabecera derecha)
    ("bloque-a", (1, 4), "CON ESTRATEGIA", "SIN ESTRATEGIA"),
    ("bloque-b", (5, 8), "CON SISTEMA", "SIN SISTEMA"),
    ("bloque-c", (9, 12), "COBRA SU VALOR", "COBRA SU TIEMPO"),
]
# turno -> (palabra clave, icono)
CONTENIDO = {
    1: ("1 oferta de $2.000", "1f48e"),
    2: ("5 productos de $20", "1f3f7"),
    3: ("Ángulo pensado", "1f3af"),
    4: ("Lo que se me ocurre", "1f3b2"),
    5: ("Sistema de seguimiento", "1f5c2"),
    6: ("DMs cuando me acuerdo", "1f4a4"),
    7: ("Aplico y domino", "1f3c6"),
    8: ("Un curso al mes", "1f4da"),
    9: ("Por resultados", "1f4c8"),
    10: ("Por horas", "23f3"),
    11: ("Subo mi valor", "1f680"),
    12: ("Espero estar lista", "1f40c"),
}
CENTRO = {"izq": 270, "der": 790}  # el lado derecho se aparta de los botones de Instagram
NOMBRE = "Yasmin Álvarez Closer"
VERDE, ROJO = "#12B847", "#E3161F"

FUENTES = f"""@font-face {{ font-family: "Inter Display"; font-weight: 900; src: url("{A}/InterDisplay-Black.otf"); }}
        @font-face {{ font-family: "Inter Display"; font-weight: 700; src: url("{A}/InterDisplay-Bold.otf"); }}"""

ESTILOS = f"""
        #root {{ position: absolute; inset: 0; font-family: "Inter Display", sans-serif; }}
        /* Palabra clave: blanca, negrita, sobre el lado que habla */
        .clave {{ position: absolute; top: 985px; width: 520px; font-weight: 700; font-size: 46px;
          line-height: 1.1; color: #fff; text-align: center; letter-spacing: -0.01em;
          text-shadow: 0 2px 6px rgba(0,0,0,.85), 0 0 18px rgba(0,0,0,.55); }}
        /* Cabecera: Black, mayúsculas, verde / rojo con contorno blanco */
        .cabecera {{ position: absolute; top: 1050px; width: 520px; display: flex; flex-direction: column;
          align-items: center; font-weight: 900; font-size: 74px; line-height: 0.95; letter-spacing: -0.02em;
          -webkit-text-stroke: 5px #fff; paint-order: stroke fill;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,.55)); }}
        .izq.cabecera, .izq.tarjeta-titulo {{ color: {VERDE}; }}
        .der.cabecera, .der.tarjeta-titulo {{ color: {ROJO}; }}
        /* Iconos 3D: dos por lado en cada bloque, uno junto al otro */
        .icono {{ position: absolute; top: 1275px; width: 180px; height: 180px;
          filter: drop-shadow(0 8px 10px rgba(0,0,0,.4)); }}
        /* Tarjeta final con el perfil */
        .tarjeta-titulo {{ position: absolute; top: 985px; width: 450px; display: flex; flex-direction: column;
          align-items: center; font-weight: 900; font-size: 40px; line-height: 1.05; text-align: center;
          -webkit-text-stroke: 4px #fff; paint-order: stroke fill; filter: drop-shadow(0 3px 5px rgba(0,0,0,.55)); }}
        .tarjeta-img {{ position: absolute; top: 1185px; width: 450px; border-radius: 18px;
          box-shadow: 0 10px 24px rgba(0,0,0,.45); }}"""


def t(x):
    return f"{x:.3f}".rstrip("0").rstrip(".")


def subcomposicion(cid, capas, anims):
    capas_html = "\n".join("        " + c for c in capas)
    anims_js = "\n".join("        " + a for a in anims)
    return f"""<!doctype html>
<html lang="es">
  <head><meta charset="UTF-8" /></head>
  <body>
    <template>
      <style>
        {FUENTES}{ESTILOS}
      </style>
      <div id="root" data-composition-id="{cid}" data-width="1080" data-height="1920">
{capas_html}
      </div>
      <script>
        const tl = gsap.timeline({{ paused: true }});
{anims_js}
        window.__timelines["{cid}"] = tl;
      </script>
    </template>
  </body>
</html>
"""


hosts, sonidos = [], []
for cid, (a, b), izq, der in BLOQUES:
    t0, t1 = turnos[a - 1]["inicio"], turnos[b - 1]["fin"]
    dur = t1 - t0
    capas, anims = [], []
    for lado, texto in (("izq", izq), ("der", der)):
        p1, p2 = texto.split(" ", 1)
        capas.append(
            f'<div id="{cid}-cabecera-{lado}" class="clip cabecera {lado}" data-start="0" '
            f'data-duration="{t(dur)}" data-track-index="{1 if lado == "izq" else 2}" '
            f'style="left:{CENTRO[lado] - 260}px"><span>{p1}</span><span>{p2}</span></div>'
        )
    vistos = {"izq": 0, "der": 0}
    for n in range(a, b + 1):
        tr = turnos[n - 1]
        lado = tr["lado"]
        ini, fin = tr["inicio"] - t0, tr["fin"] - t0
        voz = tr["voz"] - t0
        habla = fin - voz - 0.25
        pop = round(voz + 0.55 * habla, 3)
        palabra, icono = CONTENIDO[n]
        pista = 3 if lado == "izq" else 4
        capas.append(
            f'<div id="clave-{n}" class="clip clave" data-start="{t(ini)}" data-duration="{t(fin - ini)}" '
            f'data-track-index="{pista}" style="left:{CENTRO[lado] - 260}px">{palabra}</div>'
        )
        anims.append(f'tl.fromTo("#clave-{n}", {{scale: 0.9}}, {{scale: 1, duration: 0.14, ease: "back.out(3)"}}, {t(ini)});')
        x = CENTRO[lado] + (-95 if vistos[lado] == 0 else 95) - 90
        vistos[lado] += 1
        capas.append(
            f'<img id="icono-{n}" class="clip icono" src="{A}/icons/{icono}.png" alt="" '
            f'data-start="{t(pop)}" data-duration="{t(dur - pop)}" data-track-index="{pista + 2}" '
            f'style="left:{x}px">'
        )
        anims.append(f'tl.fromTo("#icono-{n}", {{scale: 0}}, {{scale: 1, duration: 0.24, ease: "back.out(2.6)"}}, {t(pop)});')
        sonidos.append(
            f'<audio id="pop-{n}" src="assets/pop.mp3" data-start="{t(t0 + pop)}" data-duration="0.72" '
            f'data-track-index="5" data-volume="0.55"></audio>'
        )
    (RAIZ / f"compositions/{cid}.html").write_text(subcomposicion(cid, capas, anims))
    hosts.append((cid, t0, dur))

# Cierre: tarjeta de perfil por lado, con campana.
t0 = turnos[12]["inicio"]
dur = FIN - t0
capas, anims = [], []
for n, lado, titulo in ((13, "izq", "Yo sí sigo a"), (14, "der", "No sigo a")):
    ini = turnos[n - 1]["inicio"] - t0
    resto = dur - ini
    izquierda = CENTRO[lado] - 225
    pista = 1 if lado == "izq" else 3
    capas.append(
        f'<div id="titulo-{n}" class="clip tarjeta-titulo {lado}" data-start="{t(ini)}" data-duration="{t(resto)}" '
        f'data-track-index="{pista}" style="left:{izquierda}px"><span>{titulo}</span><span>{NOMBRE}</span></div>'
    )
    capas.append(
        f'<img id="perfil-{n}" class="clip tarjeta-img" src="{A}/perfil.jpg" alt="Perfil de {NOMBRE}" '
        f'data-start="{t(ini)}" data-duration="{t(resto)}" data-track-index="{pista + 1}" style="left:{izquierda}px">'
    )
    sonidos.append(
        f'<audio id="ding-{n}" src="assets/ding.wav" data-start="{t(t0 + ini)}" data-duration="{t(min(2.6, resto))}" '
        f'data-track-index="{6 + (n - 13)}" data-volume="0.32"></audio>'
    )
    for el in (f"#titulo-{n}", f"#perfil-{n}"):
        anims.append(
            f'tl.fromTo("{el}", {{scale: 0.55, filter: "blur(8px)"}}, '
            f'{{scale: 1, filter: "blur(0px)", duration: 0.22, ease: "back.out(2)"}}, {t(ini)});'
        )
(RAIZ / "compositions/cierre.html").write_text(subcomposicion("cierre", capas, anims))
hosts.append(("cierre", t0, dur))

host_html = "\n".join(
    f'      <div id="{cid}" data-composition-id="{cid}" data-composition-src="compositions/{cid}.html" '
    f'data-start="{t(s)}" data-duration="{t(d)}" data-track-index="{i + 1}" data-width="1080" data-height="1920"></div>'
    for i, (cid, s, d) in enumerate(hosts)
)

sonidos_html = "\n".join("      " + x for x in sonidos)
(RAIZ / "index.html").write_text(f"""<!doctype html>
<html lang="es" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <script src="assets/gsap.min.js"></script>
    <style>
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ margin: 0; width: 1080px; height: 1920px; overflow: hidden; background: #000; }}
      #root {{ width: 100%; height: 100%; position: relative; }}
      #base {{ position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{t(FIN)}" data-width="1080" data-height="1920">
      <video id="base" class="clip" src="assets/base.mp4" playsinline data-has-audio="true"
        data-start="0" data-duration="{t(FIN)}" data-track-index="0" data-volume="1"></video>
{host_html}
{sonidos_html}
    </div>
    <script>
      const tl = gsap.timeline({{ paused: true }});
      window.__timelines["main"] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
""")
print(f"{len(hosts)} sub-composiciones, {FIN:.2f} s")
