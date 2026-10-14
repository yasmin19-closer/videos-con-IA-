#!/usr/bin/env python3
"""Time a video script beat by beat before you shoot it.

Usage:
    python3 beats.py script.txt --target 30
    python3 beats.py script.txt --target 45 --wpm 150

Each non-blank line (or paragraph) is one beat. A beat can carry a label:
    HOOK: Te dijeron "lo voy a pensar"?
    [CTA] Escribeme "CIERRE" y te mando el guion.
Lines starting with '#' are ignored. Estimates use words per minute plus
short pauses for punctuation, so read it aloud once to calibrate --wpm.
"""
import argparse
import re
import sys

PAUSE = {".": 0.35, "?": 0.4, "!": 0.35, ",": 0.15, ";": 0.2, ":": 0.25,
         "…": 0.5}
LABEL = re.compile(r"^\s*(?:\[([^\]]+)\]|([A-Za-zÀ-ÿ ]{2,12}):)\s*")


def parse(text):
    beats = []
    for block in re.split(r"\n\s*\n", text):
        for line in block.splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            m = LABEL.match(line)
            label = (m.group(1) or m.group(2)).strip().upper() if m else ""
            body = line[m.end():] if m else line
            beats.append((label, body))
    return beats


def duration(body, wpm):
    words = len(re.findall(r"[\w']+", body))
    pauses = sum(PAUSE.get(c, 0) for c in body.replace("...", "…"))
    return words, words / wpm * 60 + pauses


def main():
    ap = argparse.ArgumentParser(description="Estimate spoken length per beat.")
    ap.add_argument("file", help="script file ('-' for stdin)")
    ap.add_argument("--target", type=float, help="target length in seconds")
    ap.add_argument("--wpm", type=float, default=160,
                    help="speaking rate in words per minute (default 160)")
    ap.add_argument("--hook-max", type=float, default=3.0,
                    help="the first beat should end by this second (default 3)")
    args = ap.parse_args()

    src = sys.stdin if args.file == "-" else open(args.file, encoding="utf-8")
    with src:
        beats = parse(src.read())
    if not beats:
        sys.exit("no beats found")

    rows, t = [], 0.0
    for i, (label, body) in enumerate(beats, 1):
        words, secs = duration(body, args.wpm)
        rows.append((i, label, body, words, t, t + secs, secs))
        t += secs
    total = t

    print(f"{'#':>2}  {'start':>6}  {'end':>6}  {'len':>5}  beat")
    for i, label, body, words, start, end, secs in rows:
        tag = f"{label}: " if label else ""
        text = tag + body
        if len(text) > 70:
            text = text[:67] + "..."
        print(f"{i:>2}  {start:>5.1f}s  {end:>5.1f}s  {secs:>4.1f}s  {text}")

    print(f"\nTotal: {total:.1f}s at {args.wpm:g} wpm "
          f"({sum(r[3] for r in rows)} words, {len(rows)} beats)")

    hook_end = rows[0][5]
    if hook_end > args.hook_max:
        print(f"! Hook ends at {hook_end:.1f}s; get it under {args.hook_max:g}s.")
    else:
        print(f"ok Hook lands at {hook_end:.1f}s.")

    if args.target:
        diff = total - args.target
        if abs(diff) <= max(1.0, args.target * 0.05):
            print(f"ok On target ({args.target:g}s, {diff:+.1f}s).")
        elif diff > 0:
            cut = round(diff * args.wpm / 60)
            print(f"! {diff:.1f}s over {args.target:g}s: cut about {cut} words.")
            longest = sorted(rows[1:], key=lambda r: r[6], reverse=True)[:3]
            if longest:
                print("  Longest beats to trim first: " +
                      ", ".join(f"#{r[0]} ({r[6]:.1f}s)" for r in longest))
        else:
            room = round(-diff * args.wpm / 60)
            print(f"~ {-diff:.1f}s under {args.target:g}s: room for about "
                  f"{room} more words, or leave it as breathing room for b-roll.")


if __name__ == "__main__":
    main()
