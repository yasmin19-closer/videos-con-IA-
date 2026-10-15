#!/usr/bin/env python3
"""Check an Instagram caption against what the feed actually shows.

Usage:
    python3 caption.py caption.txt
    python3 caption.py caption.txt --terms "freelance contracts, client contracts"

The feed shows roughly the first 125 characters (or up to the first line
break) before "... more". Everything that has to stop the scroll must sit
there. Works with Spanish and English captions.

Checks:
    LENGTH            under Instagram's 2200 character limit
    FIRST LINE        fits before the 125 character cut
    HOOK IS CONCRETE  numbers or names inside the visible window
    HASHTAGS          3-5 tags
    ONE ASK           exactly one call to action
    SEARCH TERMS      every --terms phrase appears (captions are searchable)
"""
import argparse
import re
import sys
import textwrap
import unicodedata

LIMIT = 2200
CUT = 125
BOX = 52  # inner width of the feed preview

NUMBER_WORDS = {"one", "two", "three", "four", "five", "six", "seven", "eight",
                "nine", "ten", "hundred", "thousand", "million", "uno", "dos",
                "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve",
                "diez", "cien", "mil", "millon", "millones"}

ASKS = [
    ("comment a keyword",
     r"(?i:\b(comment|comenta|escribe|escribeme|reply|responde)\b)[^.\n]{0,25}"
     r"(\"[^\"]+\"|“[^”]+”|«[^»]+»|\b[A-ZÑ]{3,}\b)"),
    ("link in bio", r"\b(link in (my )?bio|link en (mi |la )?bio|enlace en (mi |la )?bio)\b"),
    ("send a DM", r"\b(dm me|send me a (dm|message)|mandame un (dm|mensaje)|"
                  r"escribeme (al|por) (dm|md|privado)|al privado)\b"),
    ("save", r"\b(save this|save it|guarda(lo|la|este|esta)?\b(?! silencio))"),
    ("share", r"\b(share this|send this to|tag someone|comparte(lo)?|"
              r"enviaselo|mandaselo|etiqueta a)\b"),
    ("follow", r"\b(follow (me|for)|sigueme|seguime)\b"),
]


def strip_accents(text):
    text = unicodedata.normalize("NFD", text)
    return "".join(c for c in text if unicodedata.category(c) != "Mn")


def norm(text):
    return strip_accents(text.lower())


def visible_window(caption):
    first = caption.split("\n", 1)[0]
    return first[:CUT], len(first) > CUT or "\n" in caption.strip()


def concrete(window):
    """Numbers and proper names a viewer can picture."""
    hits = re.findall(r"[$€]?\d[\d.,]*%?", window)
    words = re.findall(r"[\w']+", window)
    hits += [w for w in words if norm(w) in NUMBER_WORDS]
    # Capitalised words that do not open a sentence or a quote (and aren't "I").
    for m in re.finditer(r"\b[A-Z\u00c1\u00c9\u00cd\u00d3\u00da\u00d1][\w']+", window):
        before = window[:m.start()].rstrip()
        if before and before[-1] not in ".!?\"'\u201c\u00ab\u00bf\u00a1:" \
                and m.group() not in ("I", "I'm", "I've", "I'll"):
            hits.append(m.group())
    return hits


def row(status, name, detail):
    lead = f"  {status:<6}{name:<18}"
    return textwrap.fill(detail, 78, initial_indent=lead,
                         subsequent_indent=" " * len(lead))


def main():
    ap = argparse.ArgumentParser(description="Check a caption before posting.")
    ap.add_argument("file", help="caption text file ('-' for stdin)")
    ap.add_argument("--terms", action="append", default=[],
                    help="search phrases that should appear (comma-separated, repeatable)")
    args = ap.parse_args()

    src = sys.stdin if args.file == "-" else open(args.file, encoding="utf-8")
    with src:
        caption = "\n".join(l.rstrip() for l in src.read().strip().splitlines()
                            if not l.startswith("#!"))
    if not caption:
        sys.exit("empty caption")

    window, truncated = visible_window(caption)

    print("WHAT THE FEED SHOWS")
    print("  +" + "-" * (BOX + 2) + "+")
    lines = textwrap.wrap(window, BOX, break_long_words=True,
                          drop_whitespace=False) or [""]
    for line in lines:
        print(f"  | {line.strip():<{BOX}} |")
    if truncated:
        print("  +" + "-" * (BOX - 8) + " ... more +")
    else:
        print("  +" + "-" * (BOX + 2) + "+")
    print()

    n = len(caption)
    print(row("PASS" if n <= LIMIT else "FAIL", "LENGTH",
              f"{n} / {LIMIT} characters" +
              ("" if n <= LIMIT else ", Instagram will not post it")))

    first = caption.split("\n", 1)[0]
    if len(first) <= CUT:
        print(row("PASS", "FIRST LINE",
                  f"{len(first)} characters, fits before the cut"))
    else:
        cut_at_break = first[CUT - 1] in ".!?" or first[CUT] == " "
        print(row("WARN", "FIRST LINE",
                  f"{len(first)} characters, so it gets cut at {CUT} " +
                  ("after a word" if cut_at_break else "mid-thought")))

    hits = concrete(window)
    print(row("PASS" if hits else "WARN", "HOOK IS CONCRETE",
              (f"{len(hits)} numbers or names" if len(hits) > 1 else
               "1 number or name") + " in the visible window" if hits else
              "no numbers or names in the visible window. Vague hooks get "
              "scrolled past"))

    tags = re.findall(r"(?<![\w#])#\w+", caption)
    if 3 <= len(tags) <= 5:
        status = "PASS"
    elif len(tags) > 30:
        status = "FAIL"
    else:
        status = "WARN"
    detail = (f"{len(tags)} tags: {' '.join(tags)}" if tags else
              "no tags. Add 3-5 specific ones")
    if len(tags) > 5:
        detail += ". Keep the 3-5 most specific"
    elif 0 < len(tags) < 3:
        detail += ". Add a couple more specific ones"
    print(row(status, "HASHTAGS", detail))

    plain = norm(caption)
    cased = strip_accents(caption)  # keyword detection needs CAPS intact
    asks = [name for name, pat in ASKS
            if re.search(pat, cased if name == "comment a keyword" else plain)]
    if len(asks) == 1:
        print(row("PASS", "ONE ASK", f"one call to action: {asks[0]}"))
    elif not asks:
        print(row("WARN", "ONE ASK",
                  "no call to action. Tell them the one thing to do next"))
    else:
        print(row("WARN", "ONE ASK",
                  f"{len(asks)} calls to action ({', '.join(asks)}). Pick one; "
                  "every extra ask splits the response"))

    terms = [t.strip() for group in args.terms for t in group.split(",") if t.strip()]
    if terms:
        missing = [t for t in terms if norm(t) not in plain]
        found = len(terms) - len(missing)
        print(row("PASS" if not missing else "WARN", "SEARCH TERMS",
                  f"{found}/{len(terms)} present" +
                  (f". Missing: {', '.join(missing)}" if missing else "")))
    else:
        print(row("SKIP", "SEARCH TERMS",
                  'pass --terms "phrase one, phrase two" to check'))


if __name__ == "__main__":
    import signal
    if hasattr(signal, "SIGPIPE"):  # quiet exit when piped into head
        signal.signal(signal.SIGPIPE, signal.SIG_DFL)
    main()
