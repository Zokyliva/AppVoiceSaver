import { useCallback, useRef, useState } from "react";

// --- Custom Hook Pattern + SRP ---
// useRecorder gère UNIQUEMENT le cycle de vie de l'enregistrement audio
// (permissions, start/pause/stop, niveaux sonores pour la vague visuelle).
// Il ne sait rien de la transcription ni du stockage (ISP : interface
// volontairement étroite, chaque hook n'expose que ce dont il a besoin).
export function useRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [levels, setLevels] = useState([]);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);

  const monitorLevels = useCallback((stream) => {
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;
    source.connect(analyser);
    analyserRef.current = { audioCtx, analyser };

    const data = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => {
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b, 0) / data.length;
      setLevels((prev) => [...prev.slice(-24), avg]);
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();
  }, []);

  const start = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.start();

      mediaRecorderRef.current = recorder;
      monitorLevels(stream);
      setIsRecording(true);
      setIsPaused(false);
    } catch (err) {
      setError("Accès au microphone refusé ou indisponible.");
    }
  }, [monitorLevels]);

  const pauseOrResume = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;
    if (recorder.state === "recording") {
      recorder.pause();
      setIsPaused(true);
    } else if (recorder.state === "paused") {
      recorder.resume();
      setIsPaused(false);
    }
  }, []);

  const stop = useCallback(() => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder) return resolve(null);

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        recorder.stream.getTracks().forEach((track) => track.stop());
        cancelAnimationFrame(rafRef.current);
        analyserRef.current?.audioCtx.close();
        setIsRecording(false);
        setIsPaused(false);
        setLevels([]);
        resolve(blob);
      };
      recorder.stop();
    });
  }, []);

  return { isRecording, isPaused, levels, error, start, pauseOrResume, stop };
}
