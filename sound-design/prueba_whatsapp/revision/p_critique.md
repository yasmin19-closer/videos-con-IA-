# Critique, round 1

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.37s |
| sync | n/a | not judged: no peak-anchored cue could be measured (clicks only, layers on one moment, a crowded neighbour). Check the frames with zoom.py |
| coverage | n/a | not measured (pass --moments) |
| pacing | 1.0 | 0.2 weighted events per 10 s, longest silence 60.2 s |
| variety | 10.0 | 1 source recordings, 1 families in 1 sounds (runs and interface sounds not counted) |
| hierarchy | n/a | not judged: fewer than 6 sounds |
| headroom | 10.0 | true peak -1.0 dBTP |
| loudness | 10.0 | final -14.9 LUFS (the author's own balance is kept) |
| balance | 10.0 | SFX are +10.3 LU below the original audio (-25.1 LUFS) |
| speech | 10.0 | 0 sound(s) in 0 moment(s) are within 3 dB of the voice or above it (0 above) even after ducking |
| low_end | 10.0 | 0 heavy sound(s) on top of existing bass |
| mono | 10.0 | the SFX track loses 1.8 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 1 sounds lose more than 6 dB; the film loses 1.1 LU in mono against 1.1 LU for the original (+0.0 added) |

**FIX**: lowest axis 1.0 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. pacing: nothing happens between 0.37s and 1:00.54 (60.2 s)

Listen to this moment, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.37s  'P-C01 reencuadre de cama': the first sound of the film: the hook; the highest peak of the film (-18 dBFS before the master). Listen for: does it land with the picture at once, and is it clearly there under the music or the voice? / is it big without hurting on headphones, and does the music under it pump?
  -> /home/user/videos-con-IA-/sound-design/prueba_whatsapp/escucha/p_escucha.wav: the 1 in this order, 3 s each

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).