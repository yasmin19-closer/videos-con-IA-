#!/usr/bin/env python3
"""Strip the AI-writing tics from a draft that can be fixed safely.

Usage:
    python3 humanize.py draft.txt                  # print the clean text
    python3 humanize.py draft.txt --report         # clean it, show every change
    python3 humanize.py draft.txt -o after.txt     # save it, then:
    python3 detect.py draft.txt after.txt          # prove the delta

Fixes: stock phrases with a plain equivalent ("es importante destacar que",
"utilize"), em dashes, "Además," / "Moreover," sentence openers, doubled
punctuation. What has no safe automatic fix (sentence rhythm, "no es X, es Y"
formulas, flag-only phrases like "al siguiente nivel") is listed under LEFT
FOR YOU: rewrite those in your own words.
"""
import argparse
import re
import sys

from detect import DASH, FORMULAS, STOCK, TRANSITION, WIDTH, analyze, read

MARK = "\x00"  # where a removal left a sentence without its first word


def at_sentence_start(text, pos):
    before = text[:pos].rstrip(" \t")
    return not before or before[-1] in ".!?\n…\"“«¿¡"


def humanize(text):
    changes = []

    def apply(pattern, repl, flags=re.I):
        nonlocal text

        def sub(m):
            new = repl(m) if callable(repl) else repl
            line = text.count("\n", 0, m.start()) + 1
            changes.append((line, m.group(), new))
            if new == "" and at_sentence_start(text, m.start()):
                return MARK
            if new and m.group()[:1].isupper():
                return new[:1].upper() + new[1:]
            return new

        text = re.sub(pattern, sub, text, flags=flags)

    for pat, repl in STOCK:
        if repl is not None:
            apply(pat, repl)
    apply(TRANSITION, "", flags=0)
    apply(DASH, ", ", flags=0)
    apply(r"([!?])\1+", lambda m: m.group(1), flags=0)

    text = re.sub(MARK + r"(\s*)(\w)", lambda m: m.group(1) + m.group(2).upper(), text)
    text = text.replace(MARK, "")
    text = re.sub(r"(?<=\S) {2,}", " ", text)
    text = re.sub(r" +([,.;:!?])", r"\1", text)
    text = re.sub(r",\s*([.!?])", r"\1", text)
    text = re.sub(r",,+", ",", text)
    return text, changes


def left_for_you(text):
    items = []
    for pat, repl in STOCK:
        if repl is None:
            items += [f'phrase "{m.group().strip()}"' for m in re.finditer(pat, text, re.I)]
    for pat in FORMULAS:
        items += [f'formula "{m.group()[:40]}"' for m in re.finditer(pat, text, re.I)]
    rhythm = next(c for c in analyze(text)["checks"] if c[0] == "RHYTHM")
    if rhythm[1] >= 25:
        items.append(f"rhythm: {rhythm[2]}. Break one long sentence, "
                     "merge two short ones")
    return items


def main():
    ap = argparse.ArgumentParser(description="Clean AI-writing tics from a draft.")
    ap.add_argument("file", help="draft text file ('-' for stdin)")
    ap.add_argument("--report", action="store_true", help="list every change")
    ap.add_argument("-o", "--output", help="write the clean text here")
    args = ap.parse_args()

    before = read(args.file)
    after, changes = humanize(before)

    if args.report:
        b, a = analyze(before)["score"], analyze(after)["score"]
        print(f"HUMANIZE  ·  {args.file}  ·  {len(changes)} changes  "
              f"·  score {b} -> {a}")
        print("=" * WIDTH)
        for line, old, new in sorted(changes, key=lambda c: c[0]):
            old_s = old.replace("\n", " ").strip() or old
            new_s = f'"{new}"' if new.strip() else "(removed)"
            print(f"  L{line:<4}\"{old_s}\"  ->  {new_s}")
        if not changes:
            print("  nothing to fix automatically")
        left = left_for_you(after)
        if left:
            print("-" * WIDTH)
            print("  LEFT FOR YOU")
            for item in left:
                print(f"  - {item}")
        print("=" * WIDTH)

    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(after.rstrip() + "\n")
        if args.report:
            print(f"  saved to {args.output}")
    else:
        print(after)


if __name__ == "__main__":
    main()
