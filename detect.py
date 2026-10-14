#!/usr/bin/env python3
"""Score how machine-written a draft sounds, with five checks.

Usage:
    python3 detect.py draft.txt                 # score one draft
    python3 detect.py before.txt after.txt      # prove the delta

Checks (each 0-100, lower is better):
    STOCK PHRASES   "es importante destacar", "delve into", "game-changer"...
    EM DASHES       the punctuation mark models overuse
    RHYTHM          every sentence about the same length
    FORMULAS        "no es X, es Y", "not just X but Y", lists of three
    TRANSITIONS     sentences opening with "Además," / "Moreover,"

This is a style heuristic for your own copy, not an AI detector: it points at
the tics that make text sound generated so you can rewrite them in your voice.
Works with Spanish and English. humanize.py fixes what can be fixed safely.
"""
import argparse
import re
import statistics
import sys

WIDTH = 72

# (pattern, replacement). replacement None means flag only: no safe rewrite.
STOCK = [
    # English
    (r"\bit'?s (?:important|worth) (?:to note|noting|mentioning) that\s*", ""),
    (r"\bin today'?s (?:fast-paced|digital|ever-changing|competitive) "
     r"(?:world|landscape|age|market),?\s*", ""),
    (r"\bat the end of the day,?\s*", ""),
    (r"\bdelve into\b", "dig into"),
    (r"\bdelves into\b", "digs into"),
    (r"\bdelving into\b", "digging into"),
    (r"\butilize\b", "use"),
    (r"\butilizes\b", "uses"),
    (r"\butilizing\b", "using"),
    (r"\bleverage\b", "use"),
    (r"\bembark on\b", "start"),
    (r"\bis a testament to\b", "shows"),
    (r"\bnavigate the complexities of\b", "handle"),
    (r"\belevate your\b", "improve your"),
    (r"\bcutting-edge\b", "new"),
    (r"\bgame[- ]changer\b", "big change"),
    (r"\bunlock (?:your|the) (?:full |true )?potential\b", None),
    (r"\b(?:rich )?tapestry\b", None),
    (r"\bseamless(?:ly)?\b", None),
    (r"\brobust\b", None),
    (r"\bjourney\b", None),
    (r"\bwhether you'?re an? [^,.]{1,40} or an? [^,.]{1,40}", None),
    # Spanish
    (r"\bes importante (?:destacar|mencionar|señalar|recordar|tener en cuenta) que\s*", ""),
    (r"\bcabe (?:destacar|mencionar|señalar|recalcar) que\s*", ""),
    (r"\ben el (?:mundo|panorama|mercado) (?:actual|de hoy|competitivo de hoy|digital),?\s*", ""),
    (r"\bsin lugar a dudas,?\s*", ""),
    (r"\ben definitiva,?\s*", ""),
    (r"\bde manera (?:eficiente|efectiva|significativa)\b", "bien"),
    (r"\bpotenciar\b", "mejorar"),
    (r"\bsumerg(?:irnos|irte|ete|émonos) en\b", None),
    (r"\bal siguiente nivel\b", None),
    (r"\bun antes y un después\b", None),
    (r"\bdesbloque(?:ar|a) (?:tu|todo tu) potencial\b", None),
    (r"\b(?:transformar|revolucionar) (?:tu|la forma)\b", None),
    (r"\bya seas (?:un|una) [^,.]{1,40} o (?:un|una) [^,.]{1,40}", None),
]

TRANSITION = (r"(?m)(?:^|(?<=[.!?] ))(?:Moreover|Furthermore|Additionally|"
              r"In conclusion|In summary|Ultimately|Overall|Notably|Importantly|"
              r"Además|Asimismo|Por otro lado|En conclusión|En resumen|"
              r"Por último|Finalmente|En definitiva|De igual manera),\s*")

FORMULAS = [
    r"\b(?:it'?s|this is|that'?s) not (?:just |only |about )?[^,.;]{1,40}[,;] "
    r"(?:it'?s|but)\b",
    r"\bnot (?:just|only) [^,.;]{1,40},? but (?:also )?",
    r"\bno es (?:solo |sólo |solamente )?[^,.;]{1,40}[,;] es\b",
    r"\bno (?:solo|sólo|solamente) [^,.;]{1,40},? sino (?:también )?",
    r"\b\w+, \w+(?: \w+)?,? (?:and|y|e) \w+\b",  # lists of three
]

DASH = re.compile(r"\s?—\s?|\s–\s")


def words(text):
    return re.findall(r"[\w'$€%.,]+", text)


def sentences(text):
    parts = re.split(r"(?<=[.!?…])\s+|\n+", text)
    return [p for p in parts if len(re.findall(r"\w+", p)) >= 2]


def clamp(x):
    return max(0, min(100, round(x)))


def analyze(text):
    n = max(1, len(words(text)))
    per100 = lambda c: c / n * 100
    sents = sentences(text)
    checks = []

    found = []
    for pat, _ in STOCK:
        found += [m.group().strip(" ,") for m in re.finditer(pat, text, re.I)]
    checks.append(("STOCK PHRASES", clamp(per100(len(found)) * 35),
                   f"{len(found)} found: " + ", ".join(dict.fromkeys(f.lower() for f in found))
                   if found else "none found"))

    dashes = len(DASH.findall(text))
    checks.append(("EM DASHES", clamp(per100(dashes) * 100),
                   f"{dashes} em dash{'es' if dashes != 1 else ''} "
                   f"({per100(dashes):.1f} per 100 words)" if dashes else "none"))

    lens = [len(re.findall(r"\w+", s)) for s in sents]
    if len(lens) >= 3:
        cv = statistics.pstdev(lens) / statistics.mean(lens)
        score = clamp((0.5 - cv) / 0.3 * 100)
        detail = (f"{'sentence length varies' if score < 25 else 'sentences run the same length'}"
                  f" (cv {cv:.2f}, {min(lens)}-{max(lens)} words)")
    else:
        score, detail = 0, "too few sentences to judge"
    checks.append(("RHYTHM", score, detail))

    forms = []
    for pat in FORMULAS:
        forms += [m.group() for m in re.finditer(pat, text, re.I)]
    checks.append(("FORMULAS", clamp(per100(len(forms)) * 60),
                   f"{len(forms)} found: " + "; ".join(f'"{f[:30]}"' for f in forms[:3]) +
                   (" ..." if len(forms) > 3 else "") if forms else "none found"))

    trans = [m.group().strip(" ,") for m in re.finditer(TRANSITION, text)]
    checks.append(("TRANSITIONS", clamp(len(trans) / max(1, len(sents)) * 400),
                   f"{len(trans)} sentence{'s' if len(trans) != 1 else ''} open with: " +
                   ", ".join(dict.fromkeys(trans)) if trans else "none"))

    total = round(sum(c[1] for c in checks) / len(checks))
    return {"words": n, "sentences": len(sents), "checks": checks, "score": total}


def status(score):
    return "PASS" if score < 25 else "WARN" if score < 60 else "FAIL"


def verdict(score):
    return ("reads human" if score < 25 else "mixed" if score < 50 else
            "sounds machine-written")


def row(stat, name, detail):
    import textwrap
    lead = f"  {stat:<6}{name:<16}"
    return textwrap.fill(detail, WIDTH + 6, initial_indent=lead,
                         subsequent_indent=" " * len(lead))


def read(path):
    src = sys.stdin if path == "-" else open(path, encoding="utf-8")
    with src:
        return "\n".join(l for l in src.read().splitlines()
                         if not l.lstrip().startswith("#"))


def main():
    ap = argparse.ArgumentParser(description="Score AI-writing tells in a draft.")
    ap.add_argument("files", nargs="+", metavar="file",
                    help="one draft, or before and after to compare")
    args = ap.parse_args()
    if len(args.files) > 2:
        sys.exit("give one file, or two to compare")

    if len(args.files) == 1:
        r = analyze(read(args.files[0]))
        print(f"AI TELLS  ·  {args.files[0]}  ·  {r['words']} words  "
              f"·  {r['sentences']} sentences")
        print("=" * WIDTH)
        for name, score, detail in r["checks"]:
            print(row(status(score), name, detail))
        print("-" * WIDTH)
        print(f"  SCORE  {r['score']} / 100  {verdict(r['score'])}  (lower is better)")
        return

    a, b = (analyze(read(f)) for f in args.files)
    print(f"AI TELLS  ·  {args.files[0]} -> {args.files[1]}")
    print("=" * WIDTH)
    print(f"  {'':<16}{'BEFORE':>8}{'AFTER':>9}")
    for (name, s1, _), (_, s2, _) in zip(a["checks"], b["checks"]):
        print(f"  {name:<16}{s1:>8}  ->{s2:>5}   {status(s1)} -> {status(s2)}")
    print("-" * WIDTH)
    d = b["score"] - a["score"]
    print(f"  {'SCORE':<16}{a['score']:>8}  ->{b['score']:>5}   {d:+d}  "
          f"({verdict(a['score'])} -> {verdict(b['score'])})")
    print(f"  {'WORDS':<16}{a['words']:>8}  ->{b['words']:>5}")


if __name__ == "__main__":
    main()
