#!/usr/bin/env python3
"""Rank reels by how far they beat their own account, and name the hook type.

Usage:
    python3 swipe.py swipe/reels.csv              # outliers first
    python3 swipe.py swipe/reels.csv --min 0      # show every reel
    python3 swipe.py --patterns                   # list the hook types

CSV columns (header row required):
    account,views,hook[,median][,url]
`median` is the account's typical views per reel. Leave it blank and it is
taken from the other reels of that account in the file (needs 3 or more).
`hook` is the first spoken line, as close to word for word as you can.

Views alone lie: a big account's average reel beats a small account's best.
The multiple (views / account median) shows which hooks actually broke out.
The full library with templates lives in swipe/PATRONES.md.
"""
import argparse
import csv
import re
import statistics
import sys

from hookscore import norm, score_hook

WIDTH = 78

# (number, name, pattern on accent-stripped lowercase text).
# Listed in matching priority, most specific first; numbers are stable ids.
PATTERNS = [
    (9, "The Steal",
     r"^(steal|copy|grab|take) (this|my)\b|^(robate|roba|copia|copiate|toma|quedate con) "
     r"(este|esta|esto|mi|mis)\b"),
    (3, "Nobody Tells You",
     r"\b(nobody|no one) (tells|told|talks|teaches)\b|\bnadie te (dice|cuenta|ensena|habla|explica)\b"),
    (4, "The Loss",
     r"^(i )?(lost|wasted|blew)\b|\bcost me\b|^(perdi|desperdicie|tire)\b|\bme costo\b"),
    (12, "The Confession",
     r"^(the truth|confession|i'?ll admit|what no \w+ (will )?admit)|^(la verdad|confieso|"
     r"lo que (ningun|nadie)|voy a ser honesta?)\b|nobody wants to admit|nadie quiere admitir"),
    (11, "Before / After",
     r"\bused to\b.{0,60}\bnow\b|\bantes\b.{0,60}\bahora\b|^hace (un ano|\d+ (meses|anos))"),
    (8, "The Script",
     r"^(say this|use this line|di esto|dile|respondele|responde (esto|asi))\b|"
     r"^(when|cuando) (they|a client|the client|te digan|el cliente)\b.{0,40}\b(say|di|responde)"),
    (1, "Stop Doing",
     r"^(stop|quit|don'?t|never|deja de|dejen de|no (digas|hagas|aceptes|respondas|"
     r"mandes|bajes)|nunca)\b"),
    (5, "The Callout",
     r"^(te (dijeron|dicen|ha pasado|pasa)|alguna vez|did (a|your) client|has a client|ever had)\b"),
    (10, "If You",
     r"^(if you|if your|si (te|tu|eres|vendes|estas|tienes|el cliente))\b"),
    (6, "The Contrarian",
     r"\b(is a lie|is a myth|is wrong|is dead|isn'?t about)\b|\b(casi nunca es|no es por|"
     r"es mentira|es un mito|esta muerto|no se trata de)\b"),
    (2, "The List",
     r"^(\d+|three|four|five|seven|ten|tres|cuatro|cinco|siete|diez) [a-z]"),
    (7, "The Result",
     r"^(how i|this is how i|i (closed|made|sold|went|booked))\b|^(como|asi) "
     r"(cerre|vendi|pase|consegui|logre|recupere)\b|^(cerre|vendi|recupere)\b"),
]


def classify(hook):
    t = norm(hook).strip(" \"'“«")
    for num, name, pat in PATTERNS:
        if re.search(pat, t):
            return num, name
    return None, "unclassified"


def to_int(value):
    value = (value or "").strip().lower().replace(",", "").replace("_", "")
    if not value:
        return None
    mult = 1
    if value[-1] in "km":
        mult = 1000 if value[-1] == "k" else 1_000_000
        value = value[:-1]
    return int(float(value) * mult)


def load(path):
    src = sys.stdin if path == "-" else open(path, encoding="utf-8", newline="")
    with src:
        rows = [r for r in csv.DictReader(
            l for l in src if l.strip() and not l.lstrip().startswith("#"))]
    reels = []
    for r in rows:
        r = {k.strip().lower(): (v or "").strip() for k, v in r.items() if k}
        views = to_int(r.get("views"))
        if not r.get("account") or views is None or not r.get("hook"):
            continue
        reels.append({"account": r["account"], "views": views, "hook": r["hook"],
                      "median": to_int(r.get("median")), "url": r.get("url", "")})
    return reels


def main():
    ap = argparse.ArgumentParser(description="Rank reels by outlier multiple.")
    ap.add_argument("file", nargs="?", help="reels CSV ('-' for stdin)")
    ap.add_argument("--min", type=float, default=1.0,
                    help="hide reels below this multiple (default 1.0)")
    ap.add_argument("--wpm", type=float, default=160)
    ap.add_argument("--patterns", action="store_true", help="list the hook types")
    args = ap.parse_args()

    if args.patterns:
        for num, name, _ in sorted(PATTERNS):
            print(f"  #{num:<3}{name}")
        print("\nTemplates and examples: swipe/PATRONES.md")
        return
    if not args.file:
        ap.error("give a reels CSV, or --patterns")

    reels = load(args.file)
    if not reels:
        sys.exit("no reels found (need account, views and hook columns)")

    by_account = {}
    for r in reels:
        by_account.setdefault(r["account"], []).append(r["views"])
    skipped = []
    for r in reels:
        if not r["median"]:
            others = by_account[r["account"]]
            if len(others) >= 3:
                r["median"] = statistics.median(others)
            else:
                skipped.append(r["account"])
                continue
        r["multiple"] = r["views"] / max(1, r["median"])
        r["score"] = round(score_hook(r["hook"], args.wpm)[0])
        r["type"] = classify(r["hook"])

    ranked = sorted((r for r in reels if "multiple" in r),
                    key=lambda r: r["multiple"], reverse=True)

    print(f"SWIPE FILE  ·  {len(reels)} reels  ·  {len(by_account)} accounts  "
          f"·  baseline: account median")
    print("=" * WIDTH)
    shown = 0
    for r in ranked:
        if r["multiple"] < args.min:
            continue
        shown += 1
        num, name = r["type"]
        tag = f"#{num}" if num else "-"
        print(f"{r['multiple']:>8.1f}x  hook {r['score']:>3}  {tag:<4}{name:<23}"
              f"{r['account']:<8}{r['views']:>18,}")
        hook = r["hook"] if len(r["hook"]) <= 64 else r["hook"][:61].rstrip() + "..."
        print(f"{'':11}\"{hook}\"")
        if r["url"]:
            print(f"{'':11}{r['url']}")
    hidden = len(ranked) - shown
    if hidden or skipped:
        print("-" * WIDTH)
    if hidden:
        print(f"  {hidden} reel{'s' if hidden != 1 else ''} below {args.min:g}x hidden "
              f"(--min 0 shows all)")
    if skipped:
        names = ", ".join(sorted(set(skipped)))
        print(f"  no baseline for {names}: add a median column or 3+ reels per account")

    types = {}
    for r in ranked:
        if r["multiple"] >= max(args.min, 2.0) and r["type"][0]:
            types[r["type"]] = types.get(r["type"], 0) + 1
    if types:
        best = sorted(types.items(), key=lambda kv: -kv[1])[:3]
        print("-" * WIDTH)
        print("  Breakout types: " + ", ".join(
            f"#{n} {name} ({c})" for (n, name), c in best))


if __name__ == "__main__":
    main()
