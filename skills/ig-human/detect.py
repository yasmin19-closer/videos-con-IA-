#!/usr/bin/env python3
"""Score how machine-written a draft sounds, with five checks.

Usage:
    python3 detect.py draft.txt                 # score one draft
    python3 detect.py before.txt after.txt      # prove the delta

Checks (each 0-100, lower is better), all driven by slop.json:
    TERMS        the lexicon: "es importante destacar", "delve into"...
    TELLS        16 structural tics: em dashes, "no es X, es Y", "Además,"...
    INVISIBLES   zero-width and other hidden characters pasted from a chatbot
    RHYTHM       every sentence about the same length
    REPETITION   the same word opening sentence after sentence

This is a style heuristic for your own copy, not an AI detector: it points at
the tics that make text sound generated so you can rewrite them in your voice.
Works with Spanish and English. humanize.py fixes what can be fixed safely.
"""
import argparse
import json
import os
import re
import statistics
import sys
import textwrap
import unicodedata
from collections import Counter

WIDTH = 72
HERE = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(HERE, "slop.json"), encoding="utf-8") as fh:
    SLOP = json.load(fh)

LABEL = re.compile(r"^\s*(?:\[[^\]]+\]|[A-ZÁÉÍÓÚÑ ]{2,12}:)\s*", re.M)


def term_regex(term, deleting):
    body = r"\s+".join(re.escape(w).replace("'", "['’]") for w in term.split())
    return re.compile(r"(?<!\w)" + body + r"(?!\w)" + (r",?[ \t]*" if deleting else ""), re.I)


# Longest first, so "with that being said" wins over "that being said".
TERMS = [(t["term"], term_regex(t["term"], t["replace"] == ""), t["replace"])
         for t in sorted(SLOP["terms"], key=lambda t: -len(t["term"]))]


def _cp_class(codepoints):
    parts = []
    for cp in codepoints:
        lo, _, hi = cp.partition("-")
        parts.append(chr(int(lo, 16)) + ("-" + chr(int(hi, 16)) if hi else ""))
    return re.compile("[" + "".join(parts) + "]+")


INVISIBLE = [(c["class"], _cp_class(c["codepoints"]), c["replace"],
              c.get("keep_in_emoji", False)) for c in SLOP["invisible"]]

TELLS = []
for t in SLOP["tells"]:
    flags = re.I if "i" in t["flags"] else 0
    TELLS.append(dict(t, rx=re.compile(t["pattern"], flags)))


def is_emoji(ch):
    o = ord(ch)
    return (0x1F000 <= o <= 0x1FAFF or 0x2600 <= o <= 0x27BF or o == 0xFE0F
            or 0x1F3FB <= o <= 0x1F3FF)


def invisible_hits(text):
    """(class, match) for every hidden character run that is not part of an emoji."""
    hits = []
    for name, rx, _, keep_in_emoji in INVISIBLE:
        for m in rx.finditer(text):
            if keep_in_emoji:
                before = text[m.start() - 1] if m.start() else ""
                after = text[m.end()] if m.end() < len(text) else ""
                if before and (is_emoji(before) or ord(before) == 0x1F3F4) and \
                        (not after or is_emoji(after) or "tag" in name):
                    continue
            hits.append((name, m))
    return hits


def tell_hits(text):
    """(tell, [matches]) for each tell that reaches its min_count."""
    out = []
    for t in TELLS:
        found = list(t["rx"].finditer(text))
        if len(found) >= t["min_count"]:
            out.append((t, found))
    return out


def words(text):
    return re.findall(r"[\w'$€%.,]+", text)


def sentences(text):
    text = LABEL.sub("", text)
    parts = re.split(r"(?<=[.!?…])\s+|\n+", text)
    return [p.strip() for p in parts if len(re.findall(r"\w+", p)) >= 2]


def clamp(x):
    return max(0, min(100, round(x)))


def strip_accents(text):
    text = unicodedata.normalize("NFD", text.lower())
    return "".join(c for c in text if unicodedata.category(c) != "Mn")


def analyze(text):
    n = max(1, len(words(text)))
    per100 = lambda c: c / n * 100
    sents = sentences(text)
    checks = []

    found = [m.group().strip(" ,\t") for _, rx, _ in TERMS for m in rx.finditer(text)]
    checks.append(("TERMS", clamp(per100(len(found)) * 35),
                   f"{len(found)} found: " + ", ".join(dict.fromkeys(f.lower() for f in found))
                   if found else "none found"))

    tells = tell_hits(text)
    count = sum(len(ms) for _, ms in tells)
    checks.append(("TELLS", clamp(per100(count) * 25),
                   f"{count} across {len(tells)} kind{'s' if len(tells) != 1 else ''}: " +
                   ", ".join(f"{t['name'].lower()} ({len(ms)})" for t, ms in tells)
                   if tells else "none found"))

    inv = invisible_hits(text)
    chars = sum(len(m.group()) for _, m in inv)
    checks.append(("INVISIBLES", clamp(chars * 25),
                   f"{chars} hidden character{'s' if chars != 1 else ''}: " +
                   ", ".join(dict.fromkeys(name for name, _ in inv)) if inv else "none"))

    lens = [len(re.findall(r"\w+", s)) for s in sents]
    if len(lens) >= 3:
        cv = statistics.pstdev(lens) / statistics.mean(lens)
        score = clamp((0.5 - cv) / 0.3 * 100)
        detail = (f"{'sentence length varies' if score < 25 else 'sentences run the same length'}"
                  f" (cv {cv:.2f}, {min(lens)}-{max(lens)} words)")
    else:
        score, detail = 0, "too few sentences to judge"
    checks.append(("RHYTHM", score, detail))

    openers = [strip_accents(re.findall(r"\w+", s)[0]) for s in sents]
    if len(openers) >= 4:
        word, times = Counter(openers).most_common(1)[0]
        share = times / len(openers)
        score = clamp((share - 0.2) / 0.3 * 100) if times >= 3 else 0
        detail = (f'"{word}" opens {times} of {len(openers)} sentences' if score
                  else "sentence openings vary")
    else:
        score, detail = 0, "too few sentences to judge"
    checks.append(("REPETITION", score, detail))

    total = round(sum(c[1] for c in checks) / len(checks))
    return {"words": n, "sentences": len(sents), "checks": checks, "score": total}


def status(score):
    return "PASS" if score < 25 else "WARN" if score < 60 else "FAIL"


def verdict(score):
    return ("reads human" if score < 25 else "mixed" if score < 50 else
            "sounds machine-written")


def row(stat, name, detail):
    lead = f"  {stat:<6}{name:<13}"
    return textwrap.fill(detail, WIDTH + 6, initial_indent=lead,
                         subsequent_indent=" " * len(lead))


def read(path):
    """Read a draft; lines starting with '# ' are notes, '#hashtags' stay."""
    src = sys.stdin if path == "-" else open(path, encoding="utf-8")
    with src:
        return "\n".join(l for l in src.read().splitlines()
                         if not re.match(r"\s*#(\s|$)", l))


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
    print(f"  {'':<14}{'BEFORE':>8}{'AFTER':>9}")
    for (name, s1, _), (_, s2, _) in zip(a["checks"], b["checks"]):
        print(f"  {name:<14}{s1:>8}  ->{s2:>5}   {status(s1)} -> {status(s2)}")
    print("-" * WIDTH)
    d = b["score"] - a["score"]
    print(f"  {'SCORE':<14}{a['score']:>8}  ->{b['score']:>5}   {d:+d}  "
          f"({verdict(a['score'])} -> {verdict(b['score'])})")
    print(f"  {'WORDS':<14}{a['words']:>8}  ->{b['words']:>5}")


if __name__ == "__main__":
    import signal
    if hasattr(signal, "SIGPIPE"):  # quiet exit when piped into head
        signal.signal(signal.SIGPIPE, signal.SIG_DFL)
    main()
