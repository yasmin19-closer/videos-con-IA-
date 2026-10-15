#!/usr/bin/env python3
"""Rank reels by how far they beat their own account, and name the hook type.

Usage:
    python3 swipe.py swipe/reels.csv              # outliers first
    python3 swipe.py swipe/reels.csv --min 0      # show every reel
    python3 swipe.py --patterns                   # the 26 hook formulas
    python3 swipe.py --examples | python3 ../ig-reel/hookscore.py -

CSV columns (header row required):
    account,views,hook[,median][,url]
`median` is the account's typical views per reel. Leave it blank and it is
taken from the other reels of that account in the file (needs 3 or more).
`hook` is the first spoken line, as close to word for word as you can.

Views alone lie: a big account's average reel beats a small account's best.
The multiple (views / account median) shows which hooks actually broke out.
Formulas (template, example, on-screen line, purpose, how it gets ruined,
match regex) live in skills/ig-reel/hooks.json.
"""
import argparse
import csv
import re
import statistics
import sys

import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
REEL = os.path.join(HERE, "..", "ig-reel")
sys.path.insert(0, REEL)
from hookscore import norm, score_hook  # noqa: E402

WIDTH = 78

with open(os.path.join(REEL, "hooks.json"), encoding="utf-8") as fh:
    FORMULAS = json.load(fh)["formulas"]  # list order = match priority


def classify(hook):
    raw = hook.strip().lower()
    t = norm(hook).strip(" \"'\u201c\u00ab")
    for f in FORMULAS:
        if re.search(f["match"], t) or re.search(f["match"], raw):
            return f["id"], f["name"]
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
    ap.add_argument("--patterns", action="store_true", help="list the hook formulas")
    ap.add_argument("--examples", action="store_true",
                    help="print one example hook per formula (pipe into hookscore)")
    args = ap.parse_args()

    if args.patterns:
        for f in sorted(FORMULAS, key=lambda f: f["id"]):
            print(f"  #{f['id']:<3}{f['name']:<23}{f['template']}")
            print(f"{'':28}ej: {f['example']}")
        return
    if args.examples:
        for f in sorted(FORMULAS, key=lambda f: f["id"]):
            print(f["example"])
        return
    if not args.file:
        ap.error("give a reels CSV, or --patterns / --examples")

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
    import signal
    if hasattr(signal, "SIGPIPE"):  # quiet exit when piped into head
        signal.signal(signal.SIGPIPE, signal.SIG_DFL)
    main()
