# Critique, round 2

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.28s |
| sync | n/a | not judged: no peak-anchored cue could be measured (clicks only, layers on one moment, a crowded neighbour). Check the frames with zoom.py |
| coverage | n/a | not measured (pass --moments) |
| pacing | 5.2 | 0.6 weighted events per 10 s, longest silence 3.1 s (the original audio fills the gaps it has sounds in) |
| variety | 10.0 | 2 source recordings, 2 families in 2 sounds (runs and interface sounds not counted) |
| hierarchy | n/a | not judged: fewer than 6 sounds |
| headroom | 10.0 | true peak -1.6 dBTP |
| loudness | 10.0 | final -14.0 LUFS (the author's own balance is kept) |
| balance | 10.0 | SFX are +8.4 LU below the original audio (-23.7 LUFS) |
| speech | 10.0 | 0 sound(s) in 0 moment(s) are within 3 dB of the voice or above it (0 above) even after ducking |
| low_end | 10.0 | 0 heavy sound(s) on top of existing bass |
| mono | 10.0 | the SFX track loses 0.4 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 2 sounds lose more than 6 dB; the film loses 1.5 LU in mono against 1.4 LU for the original (+0.1 added) |

**FIX**: lowest axis 5.2 (every axis must reach 8; ok to show)

Listen to these 2 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.28s  'V1-C01 zoom-out apertura': the first sound of the film: the hook; the quietest by perceived loudness among the sounds that are not ticks. Listen for: does it land with the picture at once, and is it clearly there under the music or the voice? / can it be heard at all?
  2.   32.94s  'V1-C02 push-in final': the highest peak of the film (-15 dBFS before the master). Listen for: is it big without hurting on headphones, and does the music under it pump?
  -> /home/user/videos-con-IA-/sound-design/work/r3/v1_escucha.wav: the 2 in this order, 3 s each

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).