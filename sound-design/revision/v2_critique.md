# Critique, round 2

| axis | score | basis |
|---|---|---|
| hook | 9.0 | first sound at 0.76s |
| sync | n/a | not judged: no peak-anchored cue could be measured (clicks only, layers on one moment, a crowded neighbour). Check the frames with zoom.py |
| coverage | n/a | not measured (pass --moments) |
| pacing | 2.1 | 1.0 weighted events per 10 s, longest silence 27.3 s |
| variety | 10.0 | 3 source recordings, 3 families in 3 sounds (runs and interface sounds not counted) |
| hierarchy | n/a | not judged: fewer than 6 sounds |
| headroom | 10.0 | true peak -1.6 dBTP |
| loudness | 10.0 | final -14.1 LUFS (the author's own balance is kept) |
| balance | 3.0 | median event peak +31 dB vs the original around it, big sounds +34 dB (whole-track gap +7 LU) |
| speech | 10.0 | 0 sound(s) in 0 moment(s) are within 3 dB of the voice or above it (0 above) even after ducking |
| low_end | 10.0 | 0 heavy sound(s) on top of existing bass |
| mono | 10.0 | the SFX track loses 0.3 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 3 sounds lose more than 6 dB; the film loses 1.3 LU in mono against 1.3 LU for the original (+0.0 added) |

**FIX**: lowest axis 2.1 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. pacing: nothing happens between 0.76s and 28.09s (27.3 s)
2. balance: sounds sit +34 dB over the original around them: they bury the voice/music, lower with --sfx-trim-db or --voice-safe

Listen to these 2 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.76s  'V2-C01 zoom rebote apert': the first sound of the film: the hook; the quietest by perceived loudness among the sounds that are not ticks. Listen for: does it land with the picture at once, and is it clearly there under the music or the voice? / can it be heard at all?
  2.   28.36s  'V2-C03 llegada plano cer': the highest peak of the film (-13 dBFS before the master). Listen for: is it big without hurting on headphones, and does the music under it pump?
  -> /home/user/videos-con-IA-/sound-design/work/r3/v2_escucha.wav: the 2 in this order, 3 s each

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).