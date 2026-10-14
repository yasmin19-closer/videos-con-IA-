---
name: ig-profile
description: Score an Instagram profile out of 100 with a fixed rubric and list the fixes worth the most points. Use when reviewing or setting up a profile.
---

# ig-profile

Read `templates/voice.md` first.

Score the profile (from a screenshot or the pasted name, bio, link,
highlights, pinned posts and last 9 posts) with `rubric.json`: 11 criteria,
100 points. Award each check's points fully or not at all; when unsure, don't
award it. Report:

1. The total and its band.
2. Each criterion as `points / max` with the checks that failed.
3. The three fixes worth the most points, rewritten in the user's voice
   (e.g. a new bio line 1, a name field with the search keyword).
