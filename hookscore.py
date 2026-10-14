#!/usr/bin/env python3
"""Rank short-form video hooks (opening lines) by heuristic strength.

Usage:
    python3 hookscore.py hooks.txt            # one hook per line
    python3 hookscore.py hooks.txt --top 5
    python3 hookscore.py hooks.txt -v         # show every dimension score
    python3 hookscore.py hooks.txt --wpm 150  # speaking rate for BREVITY

Blank lines and lines starting with '#' are ignored. Works with Spanish and
English hooks. Each hook is scored 0-100 on six dimensions:

    FRONTLOAD    the first words carry the payload, not a warm-up
    STAKES       something to lose, fear, or fix
    CURIOSITY    an open loop the viewer needs closed
    SPECIFICITY  numbers, money, quoted words instead of vague claims
    ADDRESS      talks to "you" (a first-person story is next best)
    BREVITY      can be said in about 3 seconds

A dealbreaker (greeting, "stop scrolling", preamble...) multiplies the total
down no matter how good the rest is. The score is a heuristic, not a
prediction: film the top 2-3 and let retention decide.
"""
import argparse
import re
import sys
import textwrap
import unicodedata

WIDTH = 78
WEIGHTS = {"FRONTLOAD": 0.25, "STAKES": 0.20, "CURIOSITY": 0.15,
           "SPECIFICITY": 0.15, "ADDRESS": 0.15, "BREVITY": 0.10}


def norm(text):
    text = unicodedata.normalize("NFD", text.lower())
    text = "".join(c for c in text if unicodedata.category(c) != "Mn")
    return re.sub(r"[¿¡]", "", text)  # drop Spanish ¿ ¡


def has_any(text, words):
    return any(re.search(r"(?<!\w)" + re.escape(w) + r"(?!\w)", text) for w in words)


def starts_with_any(text, words):
    return any(re.match(re.escape(w) + r"(?!\w)", text) for w in words)


# Word lists are accent-stripped and lowercase.
YOU = ["you", "your", "you're", "yourself", "tu", "tus", "te", "ti", "usted",
       "contigo", "tienes", "quieres", "puedes", "haces", "dices", "sabes",
       "estas", "eres", "dicen", "dijeron", "pregunta", "deja", "haz", "di"]
I = ["i", "i'm", "my", "me", "yo", "mi", "perdi", "aprendi", "cometi", "gane",
     "descubri", "hice"]
STAKES_HIGH = ["lost", "lose", "losing", "fail", "failed", "broke", "fired",
               "mistake", "costs", "cost me", "killing", "ruin", "wasted",
               "perdi", "perder", "pierdes", "fracase", "error", "errores",
               "cuesta", "costo", "arruina", "matando", "desperdicias",
               "se te van", "se va", "dejes ir", "no los dejes", "quiebra",
               "caro", "no tengo dinero"]
STAKES_MID = ["stop", "never", "don't", "wrong", "supposed to", "myth", "lie",
              "deja de", "nunca", "no digas", "no hagas", "mito", "mentira",
              "casi nunca", "equivocado", "jamas", "olvida", "no aceptes"]
CURIOSITY = ["nobody", "no one", "why", "how", "secret", "truth", "this",
             "what if", "the real", "nadie", "por que", "como", "secreto",
             "verdad", "esto", "esta", "lo que", "la razon", "y si", "realmente",
             "casi nunca"]
VAGUE = ["things", "stuff", "content strategy", "tips", "some", "cosas",
         "algunos", "consejos", "estrategia de contenido"]

DEALBREAKERS = [
    (["hey", "hi", "hello", "hola", "buenas", "buenos dias", "que tal",
      "welcome", "bienvenidos"], True, 0.2,
     "Greeting. Nobody came to the feed to be greeted."),
    (["stop scrolling", "don't scroll", "wait don't", "para de scrollear",
      "deja de scrollear", "no deslices", "espera no", "no pases"], True, 0.7,
     'Opens with "stop scrolling". Asking for attention proves you have not '
     'earned it.'),
    (["my name is", "me llamo", "soy la", "soy el"], True, 0.3,
     "Self-introduction. Nobody knows you yet, so nobody cares who you are."),
    (["in this video", "today i", "today we", "en este video", "hoy les",
      "hoy te voy", "hoy vamos", "les voy a hablar", "te voy a hablar"],
     False, 0.4, "Preamble. Announcing the video delays the payoff."),
    (["i think", "maybe", "kind of", "creo que", "quizas", "tal vez",
      "un poco"], False, 0.6,
     "Hedge. Doubt in the first second tells the viewer to leave."),
]

TOKEN = re.compile(r"[$€]?\d[\d.,]*%?|[\w']+")


def score_hook(hook, wpm):
    t = norm(hook).strip(" \"'“«")
    words = TOKEN.findall(t)
    n = len(words)
    secs = n / wpm * 60
    opening = " ".join(words[:6])
    number = re.search(r"\d", t)
    quoted = re.search(r"[\"“«]", hook)
    question = "?" in hook

    d = {}
    # FRONTLOAD: does the payload sit in the first three words?
    head = " ".join(words[:3])
    if (re.search(r"\d", head) or has_any(head, YOU + STAKES_HIGH + STAKES_MID +
        ["nobody", "nadie", "why", "por que"]) or hook.lstrip()[:1] in "\"“«¿"):
        d["FRONTLOAD"] = 100
    else:
        d["FRONTLOAD"] = 75

    d["STAKES"] = (100 if has_any(t, STAKES_HIGH) else
                   85 if has_any(t, STAKES_MID) else
                   70 if re.search(r"\b(grow|crecer|vender|sell|more|mas)\b", t) else 60)
    d["CURIOSITY"] = (100 if has_any(t, CURIOSITY) and (question or quoted or
                      has_any(t, ["nobody", "nadie", "this", "esto"])) else
                      85 if has_any(t, CURIOSITY) or question or quoted else 65)
    d["SPECIFICITY"] = (100 if number else 90 if quoted else
                        55 if has_any(t, VAGUE) else 75)
    d["ADDRESS"] = (100 if has_any(t, YOU) else 70 if has_any(t, I) else 55)
    d["BREVITY"] = (100 if secs <= 3.2 else 90 if secs <= 6 else
                    70 if secs <= 8 else 40)

    hits = []
    for phrases, at_start, mult, msg in DEALBREAKERS:
        if (starts_with_any(t, phrases) if at_start else has_any(opening, phrases)):
            hits.append((mult, msg))
            if at_start and mult <= 0.3:
                d["FRONTLOAD"] = 0
            elif not at_start:
                d["FRONTLOAD"] = min(d["FRONTLOAD"], 40)

    total = sum(d[k] * w for k, w in WEIGHTS.items())
    if hits:
        total *= min(m for m, _ in hits)
    return total, d, [m for _, m in hits], secs


def label(score):
    return "STRONG" if score >= 75 else "OK" if score >= 45 else "WEAK"


def clip(text, limit=62):
    return text if len(text) <= limit else text[:limit - 3].rstrip() + "..."


def main():
    ap = argparse.ArgumentParser(description="Rank video hooks, one per line.")
    ap.add_argument("file", help="text file with one hook per line ('-' for stdin)")
    ap.add_argument("--top", type=int, default=0, help="only show the best N")
    ap.add_argument("--wpm", type=float, default=160,
                    help="speaking rate in words per minute (default 160)")
    ap.add_argument("-v", "--verbose", action="store_true",
                    help="show every dimension score")
    args = ap.parse_args()

    src = sys.stdin if args.file == "-" else open(args.file, encoding="utf-8")
    with src:
        hooks = [l.strip() for l in src if l.strip() and not l.lstrip().startswith("#")]
    if not hooks:
        sys.exit("no hooks found")

    ranked = sorted(((score_hook(h, args.wpm), h) for h in hooks),
                    key=lambda r: r[0][0], reverse=True)
    if args.top:
        ranked = ranked[:args.top]

    print("HOOK RANKING")
    print("=" * WIDTH)
    pad = " " * 8
    for i, ((score, dims, breakers, secs), hook) in enumerate(ranked):
        arrow = "->" if i == 0 else "  "
        print(f"{arrow}  {score:4.1f} {label(score):<7} {clip(hook)}")
        weakest = min(dims, key=lambda k: (dims[k], -WEIGHTS[k]))
        print(f"{pad}weakest: {weakest} ({dims[weakest]})")
        if args.verbose:
            print(pad + "  ".join(f"{k[:5]} {v}" for k, v in dims.items()) +
                  f"  ({secs:.1f}s)")
        for msg in breakers:
            lead = f"{pad}dealbreaker: "
            print(textwrap.fill(msg, WIDTH, initial_indent=lead,
                                subsequent_indent=" " * len(lead)))
    print("=" * WIDTH)
    print(f"{len(hooks)} hooks at {args.wpm:g} wpm. Heuristic only: film the "
          "top 2-3 and let retention decide.")


if __name__ == "__main__":
    main()
