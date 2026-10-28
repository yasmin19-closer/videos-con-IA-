"""Transcribe un audio a palabras con tiempos: [{"w": palabra, "s": inicio, "e": fin}, ...].
Usa faster-whisper (en tu PC lo descarga solo la primera vez).
Si existe la variable SHERPA_MODEL (carpeta de un modelo sherpa-onnx parakeet), usa ese en su lugar."""
import os
import sys

MODEL = os.environ.get("WHISPER_MODEL", "small")  # tiny / base / small / medium / large-v3


def _whisper(wav):
    from faster_whisper import WhisperModel
    m = WhisperModel(MODEL, device="cpu", compute_type="int8")
    segs, _ = m.transcribe(wav, language="es", word_timestamps=True, vad_filter=True)
    return [{"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)}
            for s in segs for w in (s.words or []) if w.word.strip()]


def _sherpa(wav, d):
    import sherpa_onnx
    import soundfile as sf
    r = sherpa_onnx.OfflineRecognizer.from_transducer(
        encoder=os.path.join(d, "encoder.int8.onnx"), decoder=os.path.join(d, "decoder.int8.onnx"),
        joiner=os.path.join(d, "joiner.int8.onnx"), tokens=os.path.join(d, "tokens.txt"),
        model_type="nemo_transducer", num_threads=os.cpu_count() or 2)
    audio, sr = sf.read(wav, dtype="float32")
    st = r.create_stream(); st.accept_waveform(sr, audio); r.decode_stream(st)
    words, new = [], True
    for tok, ts in zip(st.result.tokens, st.result.timestamps):
        if tok.startswith(" "):
            new = True
        if not tok.strip():
            continue
        if new or not words:
            words.append({"w": tok.strip(), "s": ts, "e": ts + 0.08}); new = False
        else:
            words[-1]["w"] += tok
            if tok.strip(".,;:?!¿¡"):  # la puntuación llega tarde: no alarga la palabra
                words[-1]["e"] = ts + 0.08
    # el fin de cada palabra llega hasta poco antes de la siguiente (máx. 0.12 s de cola)
    for a, b in zip(words, words[1:]):
        a["e"] = min(max(a["e"], b["s"] - 0.05), a["e"] + 0.12)
    words[-1]["e"] = min(words[-1]["e"] + 0.3, len(audio) / sr)
    return [{"w": w["w"], "s": round(w["s"], 3), "e": round(w["e"], 3)} for w in words]


def transcribe(wav):
    d = os.environ.get("SHERPA_MODEL")
    return _sherpa(wav, d) if d else _whisper(wav)


if __name__ == "__main__":
    import json
    print(json.dumps(transcribe(sys.argv[1]), ensure_ascii=False, indent=1))
