// Présentationnel : dessine des barres proportionnelles aux niveaux reçus.
// Il ne mesure rien lui-même — la mesure vit dans useRecorder (SRP).
export default function Waveform({ levels = [] }) {
  return (
    <div className="flex items-end gap-1 h-14 justify-center">
      {levels.length === 0
        ? Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-1 h-2 bg-line rounded-full" />
          ))
        : levels.slice(-16).map((level, i) => (
            <div
              key={i}
              className="w-1 bg-record rounded-full transition-all"
              style={{ height: `${Math.max(8, Math.min(56, level))}px` }}
            />
          ))}
    </div>
  );
}
