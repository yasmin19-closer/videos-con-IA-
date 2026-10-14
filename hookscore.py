#!/usr/bin/env python3
"""Rank short-form video hooks (opening lines) by heuristic strength.

Usage:
    python3 hookscore.py hooks.txt            # one hook per line
    python3 hookscore.py hooks.txt --top 5
    python3 hookscore.py hooks.txt --wpm 160  # speaking rate for the 3s check

Blank lines and lines starting with '#' are ignored. Works with Spanish and
English hooks. The score is a heuristic (0-100), not a prediction: use it to
shortlist, then test the top few on camera.
"""
import argparse
import re
import sys
import unicodedata


def norm(text):
    text = unicodedata.normalize("NFD", text.lower())
    return "".join(c for c in text if unicodedata.category(c) != "Mn")


def has_any(text, words):
    return any(re.search(r"\b" + re.escape(w) + r"\b", text) for w in words)


# All word lists are accent-stripped and lowercase.
SECOND_PERSON = ["you", "your", "you're", "tu", "tus", "te", "ti", "usted",
                 "vos", "contigo", "tienes", "quieres", "puedes", "haces",
                 "dices", "sabes", "estas", "eres", "tuyo"]
CURIOSITY = ["why", "how", "secret", "nobody", "no one", "truth", "real reason",
             "this", "what if", "porque", "por que", "como", "secreto", "nadie",
             "verdad", "esto", "esta frase", "lo que", "la razon", "y si",
             "nunca te", "te cuento"]
CONTRARIAN = ["stop", "never", "don't", "wrong", "mistake", "myth", "lie",
              "deja de", "nunca", "no digas", "no hagas", "error", "mito",
              "mentira", "equivocado", "olvida", "jamas", "peor"]
OBJECTION = ["expensive", "too much", "think about it", "no money", "not now",
             "send me info", "caro", "lo voy a pensar", "lo pienso",
             "dejame pensarlo", "no tengo dinero", "no tengo tiempo",
             "ahora no", "mandame info", "hablarlo con", "mi esposa",
             "mi pareja", "no me interesa", "objecion"]
WEAK_OPENERS = ["hi", "hello", "hey guys", "hola", "buenas", "en este video",
                "in this video", "today i", "hoy les", "hoy te voy",
                "bienvenidos", "welcome", "so ", "bueno", "entonces",
                "my name", "me llamo", "soy "]
HEDGES = ["maybe", "i think", "kind of", "sort of", "quizas", "tal vez",
          "creo que", "un poco", "algo asi"]


def score_hook(hook, wpm):
    t = norm(hook)
    words = re.findall(r"[\w']+", t)
    n = len(words)
    secs = n / wpm * 60
    score = 50
    notes = []

    # Length: it has to land inside ~3 seconds.
    if n == 0:
        return 0, secs, ["empty"]
    if secs <= 3.0 and n >= 4:
        score += 15
        notes.append(f"+ lands in {secs:.1f}s")
    elif n < 4:
        score += 2
        notes.append("~ very short, may lack a payoff")
    elif secs <= 4.5:
        score += 3
        notes.append(f"~ {secs:.1f}s, trim to under 3s")
    else:
        score -= 15
        notes.append(f"- too long ({secs:.1f}s)")

    first = " ".join(words[:3])
    if any(first.startswith(w.strip()) for w in WEAK_OPENERS):
        score -= 20
        notes.append("- weak opener (greeting/preamble)")

    if has_any(t, SECOND_PERSON):
        score += 8
        notes.append("+ speaks to the viewer")
    if "?" in hook or t.startswith(("por que", "que ", "como ", "why", "how", "what")):
        score += 7
        notes.append("+ question")
    if re.search(r"\d", t):
        score += 7
        notes.append("+ specific number")
    if has_any(t, CURIOSITY):
        score += 6
        notes.append("+ curiosity gap")
    if has_any(t, CONTRARIAN):
        score += 8
        notes.append("+ pattern interrupt")
    if has_any(t, OBJECTION) or re.search(r"[\"“«]", hook):
        score += 8
        notes.append("+ names the objection")
    if has_any(t, HEDGES):
        score -= 8
        notes.append("- hedging")
    if hook.strip().endswith("."):
        score -= 2
        notes.append("~ ends flat; try ? or :")

    return max(0, min(100, score)), secs, notes


def main():
    ap = argparse.ArgumentParser(description="Rank video hooks, one per line.")
    ap.add_argument("file", help="text file with one hook per line ('-' for stdin)")
    ap.add_argument("--top", type=int, default=0, help="only show the best N")
    ap.add_argument("--wpm", type=float, default=160,
                    help="speaking rate in words per minute (default 160)")
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

    for i, ((score, secs, notes), hook) in enumerate(ranked, 1):
        print(f"{i:>2}. [{score:>3}] {hook}")
        print(f"         {'; '.join(notes)}")
    print(f"\n{len(hooks)} hooks scored at {args.wpm:g} wpm. "
          "Heuristic only: film the top 2-3 and let retention decide.")


if __name__ == "__main__":
    main()
