#!/usr/bin/env python3
"""Time a video script beat by beat before you shoot it.

Usage:
    python3 beats.py script.txt --target 30
    python3 beats.py script.txt --target 45 --wpm 150

Each non-blank line is one beat. A beat can carry a label:
    HOOK: Te dijeron "lo voy a pensar"?
    [CTA] Escribeme "CIERRE" y te mando el guion.
Without labels the first beat is the HOOK, the second starts the MID and the
last is the CTA. Lines starting with '#' are ignored. Read the script aloud
once and set --wpm to your real pace.
"""
import argparse
import re
import sys
import textwrap
import unicodedata

WIDTH = 72
MAX_BEAT = 4.0  # seconds one beat (one frame/shot) can hold attention
LABEL = re.compile(r"^\s*(?:\[([^\]]+)\]|([A-Za-zÀ-ÿ ]{2,12}):)\s*")
TOKEN = re.compile(r"[$€]?\d[\d.,]*\d%?|[$€]?\d%?|[\w']+")
STOP = {"because", "porque", "nobody", "nadie", "every", "never", "nunca",
        "should", "about", "there", "their", "where", "which", "cuando",
        "donde", "aceptes", "dijeron"}


def norm(text):
    text = unicodedata.normalize("NFD", text.lower())
    return "".join(c for c in text if unicodedata.category(c) != "Mn")


def parse(text):
    beats = []
    for line in text.splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        m = LABEL.match(line)
        label = (m.group(1) or m.group(2)).strip().upper() if m else ""
        beats.append([label, line[m.end():] if m else line])
    if beats and not any(b[0] for b in beats):
        beats[0][0] = "HOOK"
        if len(beats) >= 3:
            beats[1][0] = "MID"
            beats[-1][0] = "CTA"
    return beats


def loop_word(hook, last):
    """A number, quote or distinctive word from the hook repeated at the end."""
    quotes = re.findall(r"[\"“«]([^\"”»]+)", hook)
    tokens = TOKEN.findall(hook)
    candidates = ([t for t in tokens if re.search(r"\d", t)] + quotes +
                  [t for t in tokens if len(t) >= 6 and norm(t) not in STOP])
    end = norm(last)
    for c in candidates:
        if re.search(r"(?<!\w)" + re.escape(norm(c)) + r"(?!\w)", end):
            return c
    return None


def stamp(t):
    return f"{int(t // 60)}:{t % 60:04.1f}"


def note(text):
    return textwrap.fill(text, WIDTH, initial_indent="  - ",
                         subsequent_indent="    ")


def main():
    ap = argparse.ArgumentParser(description="Estimate spoken length per beat.")
    ap.add_argument("file", help="script file ('-' for stdin)")
    ap.add_argument("--target", type=float, help="target length in seconds")
    ap.add_argument("--wpm", type=float, default=165,
                    help="speaking rate in words per minute (default 165)")
    ap.add_argument("--hook-max", type=float, default=3.0,
                    help="the hook should be done by this second (default 3)")
    args = ap.parse_args()

    src = sys.stdin if args.file == "-" else open(args.file, encoding="utf-8")
    with src:
        beats = parse(src.read())
    if not beats:
        sys.exit("no beats found")

    rows, t = [], 0.0
    for label, body in beats:
        words = len(TOKEN.findall(body))
        secs = words / args.wpm * 60
        rows.append((label, body, words, t, secs))
        t += secs
    total = t
    n_words = sum(r[2] for r in rows)

    head = [f"BEAT SHEET", f"{n_words} words", f"~{total:.1f}s at {args.wpm:g} wpm"]
    if args.target:
        head.append(f"target {args.target:.1f}s")
    print("  ·  ".join(head))
    print("=" * WIDTH)

    lw = max(7, max(len(r[0]) for r in rows) + 1)
    indent = 2 + 6 + 1 + 5 + 1 + 2 + lw + 1
    text_w = max(20, WIDTH + 3 - indent)
    prev, long_beats = None, []
    for i, (label, body, words, start, secs) in enumerate(rows, 1):
        shown = label if label != prev else ""
        prev = label or prev
        text = body
        if len(body) > text_w:
            cut = body[:text_w - 3]
            text = (cut.rsplit(" ", 1)[0] if " " in cut else cut).rstrip(",;:") + "..."
        print(f"  {stamp(start)} {secs:5.1f}s  {shown:<{lw}} {text}")
        if secs > MAX_BEAT and i > 1:
            long_beats.append(i)
            print(" " * indent + f"^ {secs:.1f}s on one beat")
    print("-" * WIDTH)

    hook_secs = rows[0][4]
    if hook_secs > args.hook_max:
        print(note(f"Hook runs {hook_secs:.1f}s. Get the payoff out before "
                   f"{args.hook_max:g}s or the swipe happens first."))
    if long_beats:
        nums = [str(n) for n in long_beats]
        which = (f"Beat {nums[0]} runs" if len(nums) == 1 else
                 f"Beats {', '.join(nums[:-1])} and {nums[-1]} run")
        print(note(f"{which} past {MAX_BEAT:g}s. Either split the line or "
                   "change what is on screen inside it. A static frame is "
                   "where people leave."))
    if len(rows) > 1:
        echo = loop_word(rows[0][1], rows[-1][1])
        if echo:
            print(note(f'Loops: the last beat repeats "{echo}" from the hook. '
                       "Second watches are free reach."))
        else:
            print(note("No loop: the last beat shares nothing with the hook. "
                       "Echo a word or number from it and the replay feels "
                       "seamless."))
    if args.target:
        diff = total - args.target
        delta = int(abs(diff) * args.wpm / 60)
        if abs(diff) <= 1.0:
            print(note(f"On target ({diff:+.1f}s)."))
        elif diff < 0:
            print(note(f"{-diff:.1f}s under target. Either add {delta} words "
                       "or shoot it short. Short is usually right."))
        else:
            longest = max(range(1, len(rows)), key=lambda k: rows[k][4],
                          default=0) + 1
            print(note(f"{diff:.1f}s over target. Cut {delta} words, starting "
                       f"with beat {longest}."))


if __name__ == "__main__":
    main()
