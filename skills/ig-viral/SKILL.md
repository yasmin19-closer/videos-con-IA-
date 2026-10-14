---
name: ig-viral
description: Rank reels by how far they beat their own account's median and classify the hook formula behind each. Use to build a swipe file of what actually breaks out in a niche.
---

# ig-viral

1. Add reels to `reels.csv`: account, views, the account's typical views
   (median), and the first spoken line. Leave median blank to compute it from
   3+ reels of the same account.
2. `python3 skills/ig-viral/swipe.py skills/ig-viral/reels.csv` ranks them by
   views / account median, scores each hook and names its formula from
   `skills/ig-reel/hooks.json`. Reels under 1x are hidden (`--min 0` shows all).
3. `--patterns` lists the 26 formulas; `--examples` prints one example per
   formula, ready to pipe into `hookscore.py -`.

Only record real reels and real numbers.
