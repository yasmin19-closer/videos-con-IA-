---
name: ig-human
description: Find and remove AI-writing tics from captions and scripts. Use when copy sounds generated, before posting text drafted with AI, or to compare a draft before and after editing.
---

# ig-human

Read `templates/voice.md` first; rewrites should sound like the samples there.

- `python3 skills/ig-human/detect.py draft.txt` scores the draft on five checks
  (terms, tells, invisibles, rhythm, repetition), 0-100, lower is better.
- `python3 skills/ig-human/humanize.py draft.txt --report -o after.txt` runs
  three cleaning passes (invisible characters, lexicon terms, structural tells),
  lists every change by line, and lists what is LEFT FOR YOU to rewrite.
- `python3 skills/ig-human/detect.py draft.txt after.txt` proves the delta.

`slop.json` is the lexicon: 154 terms, 18 invisible character classes and 16
tells. Rewrite the LEFT FOR YOU items by hand in the user's voice; never add
facts or numbers that were not in the draft.
