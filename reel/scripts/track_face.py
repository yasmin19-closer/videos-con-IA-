"""Detecta la posición de los ojos cada 0,2 s con MediaPipe y la guarda en JSON."""
import json, sys
import cv2
import mediapipe as mp
from mediapipe.tasks.python.core import base_options as bo
from mediapipe.tasks.python.vision import face_detector as fd

video, model, out = sys.argv[1:4]
det = fd.FaceDetector.create_from_options(
    fd.FaceDetectorOptions(base_options=bo.BaseOptions(model_asset_path=model), min_detection_confidence=0.5))
cap = cv2.VideoCapture(video)
w, h = cap.get(cv2.CAP_PROP_FRAME_WIDTH), cap.get(cv2.CAP_PROP_FRAME_HEIGHT)
dur = cap.get(cv2.CAP_PROP_FRAME_COUNT) / cap.get(cv2.CAP_PROP_FPS)
samples, t = [], 0.0
while t < dur:
    cap.set(cv2.CAP_PROP_POS_MSEC, t * 1000)
    ok, frame = cap.read()
    if not ok:
        break
    res = det.detect(mp.Image(image_format=mp.ImageFormat.SRGB, data=cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)))
    if res.detections:
        d = max(res.detections, key=lambda d: d.bounding_box.width)
        kp = d.keypoints  # 0 = ojo derecho, 1 = ojo izquierdo
        b = d.bounding_box
        samples.append({"t": round(t, 2), "eyeX": round((kp[0].x + kp[1].x) / 2, 4), "eyeY": round((kp[0].y + kp[1].y) / 2, 4),
                        "faceTop": round(b.origin_y / h, 4), "faceBottom": round((b.origin_y + b.height) / h, 4),
                        "faceW": round(b.width / w, 4)})
    t = round(t + 0.2, 2)
json.dump({"width": w, "height": h, "samples": samples}, open(out, "w"), indent=1)
print(f"{len(samples)} muestras de {int(dur / 0.2) + 1}")
