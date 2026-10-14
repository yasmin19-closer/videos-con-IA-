---
name: ig-caption
description: Lint an Instagram caption and preview what the feed shows before "... more". Use before posting any caption.
---

# ig-caption

Read `templates/voice.md` first.

`python3 skills/ig-caption/caption.py caption.txt --terms "frase uno, frase dos"`

Shows the ~125 characters visible before "... more", then checks length
(2200 limit), the first-line cut, concrete numbers or names in the visible
window, 3-5 hashtags, exactly one call to action and the search terms.
Run `skills/ig-human` on the caption too.
