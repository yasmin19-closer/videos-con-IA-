---
name: ig-reel
description: Write and time the hook and script of an Instagram reel. Use for choosing a hook formula, ranking hook options, or turning a script into a timed beat sheet before filming.
---

# ig-reel

Read `templates/voice.md` first.

1. **Pick formulas.** `hooks.json` holds 26 hook formulas: template, example,
   on-screen line, what each is for, how it gets ruined and a match regex.
   Choose 2-3 that fit the idea and write 5-10 hooks from their templates.
2. **Rank them.** `python3 skills/ig-reel/hookscore.py hooks.txt` scores each
   hook on five properties (frontload, stakes, curiosity, specificity, address),
   names the weakest one and flags dealbreakers (greeting, "stop scrolling",
   preamble, self-intro, hedge). Film the top 2-3.
3. **Time the script.** `python3 skills/ig-reel/beats.py script.txt --target 30`
   gives a beat sheet: one line = one beat = one change on screen. Fix any beat
   over 4s, a hook over 3s, and end on a word from the hook so the reel loops.

Examples in `examples/`.
