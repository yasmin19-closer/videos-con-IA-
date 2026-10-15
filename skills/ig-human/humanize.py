#!/usr/bin/env python3
"""Clean the AI-writing tics out of a draft in three passes.

Usage:
    python3 humanize.py draft.txt                  # print the clean text
    python3 humanize.py draft.txt --report         # clean it, show every change
    python3 humanize.py draft.txt -o after.txt     # save it, then:
    python3 detect.py draft.txt after.txt          # prove the delta

Passes, all driven by slop.json:
    1 INVISIBLES  strip zero-width and hidden characters, normalise odd spaces
                  (emoji sequences such as family or flag emoji stay intact)
    2 TERMS       replace or delete lexicon phrases that have a plain version
    3 TELLS       fix the structural tics that have a safe fix (em dashes,
                  "Además," openers, doubled "!!", markdown bold)

Anything without a safe automatic fix (sentence rhythm, "no es X, es Y",
flag-only phrases like "al siguiente nivel") is listed under LEFT FOR YOU.
Rewrite those in your own words; templates/voice.md says what yours sound like.
"""
import argparse
import re

from detect import (TELLS, TERMS, WIDTH, analyze, invisible_hits, read,
                    tell_hits, INVISIBLE)

MARK = "\x00"  # where a deletion left a sentence without its first word


def at_sentence_start(text, pos):
    before = text[:pos].rstrip(" \t")
    return not before or before[-1] in ".!?\n…\"“«¿¡:"


def line_of(text, pos):
    return text.count("\n", 0, pos) + 1


def pass_invisibles(text, log):
    replace = {name: repl for name, _, repl, _ in INVISIBLE}
    # Right to left so earlier offsets stay valid.
    for name, m in sorted(invisible_hits(text), key=lambda h: -h[1].start()):
        new = replace[name]
        log.append((1, line_of(text, m.start()), f"{len(m.group())}x {name}", new))
        text = text[:m.start()] + new + text[m.end():]
    return text


def sub_logged(text, rx, repl, log, pass_no):
    def sub(m):
        new = m.expand(repl) if "\\" in repl else repl
        log.append((pass_no, line_of(text, m.start()), m.group(), new))
        if new == "" and at_sentence_start(text, m.start()):
            return MARK
        if new and m.group()[:1].isupper():
            return new[:1].upper() + new[1:]
        return new
    return rx.sub(sub, text)


def humanize(text):
    log = []
    text = pass_invisibles(text, log)
    for _, rx, repl in TERMS:
        if repl is not None:
            text = sub_logged(text, rx, repl, log, 2)
    for t in TELLS:
        if t["fix"] is not None and len(t["rx"].findall(text)) >= t["min_count"]:
            text = sub_logged(text, t["rx"], t["fix"], log, 3)

    text = re.sub(MARK + r"(\s*)(\w)", lambda m: m.group(1) + m.group(2).upper(), text)
    text = text.replace(MARK, "")
    text = re.sub(r"(?<=\S)[ \t]{2,}", " ", text)
    text = re.sub(r"[ \t]+([,.;:!?])", r"\1", text)
    text = re.sub(r",\s*([.!?])", r"\1", text)
    text = re.sub(r",,+", ",", text)
    return text, log


def left_for_you(text):
    items = []
    for term, rx, repl in TERMS:
        if repl is None:
            items += [f'term "{m.group()}"' for m in rx.finditer(text)]
    for t, found in tell_hits(text):
        if t["fix"] is None:
            sample = found[0].group().replace("\n", " ")[:40]
            more = f" (+{len(found) - 1} more)" if len(found) > 1 else ""
            items.append(f'{t["name"].lower()}: "{sample}"{more}. {t["note"]}')
    for name, score, detail in analyze(text)["checks"]:
        if name in ("RHYTHM", "REPETITION") and score >= 25:
            tip = ("break one long sentence, merge two short ones" if name == "RHYTHM"
                   else "start a couple of those sentences differently")
            items.append(f"{name.lower()}: {detail}. {tip}")
    return items


def main():
    ap = argparse.ArgumentParser(description="Clean AI-writing tics from a draft.")
    ap.add_argument("file", help="draft text file ('-' for stdin)")
    ap.add_argument("--report", action="store_true", help="list every change")
    ap.add_argument("-o", "--output", help="write the clean text here")
    args = ap.parse_args()

    before = read(args.file)
    after, log = humanize(before)

    if args.report:
        b, a = analyze(before)["score"], analyze(after)["score"]
        print(f"HUMANIZE  ·  {args.file}  ·  {len(log)} changes  "
              f"·  score {b} -> {a}")
        print("=" * WIDTH)
        for no, name in ((1, "INVISIBLES"), (2, "TERMS"), (3, "TELLS")):
            entries = sorted((e for e in log if e[0] == no), key=lambda e: e[1])
            print(f"  PASS {no}  {name:<12}{len(entries)} change{'s' if len(entries) != 1 else ''}")
            for _, line, old, new in entries:
                old_s = old.replace("\n", " ").strip() or repr(old)
                new_s = (f'"{new}"' if new.strip() else
                         "(space)" if new == " " else "(newline)" if new == "\n" else "(removed)")
                print(f"    L{line:<4}\"{old_s}\"  ->  {new_s}" if no > 1 else
                      f"    L{line:<4}{old_s}  ->  {new_s}")
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
    import signal
    if hasattr(signal, "SIGPIPE"):  # quiet exit when piped into head
        signal.signal(signal.SIGPIPE, signal.SIG_DFL)
    main()
