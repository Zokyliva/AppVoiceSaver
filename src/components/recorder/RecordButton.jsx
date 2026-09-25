// Présentationnel + contrôlé entièrement par props/callbacks.
// La logique (start/stop/pause) reste dans le hook useRecorder, appelé par
// la page qui utilise ce bouton. Ce composant ne fait qu'afficher l'état
// et déclencher les callbacks reçus (Dependency Inversion : il dépend
// d'une interface de callbacks, pas d'une implémentation précise).
export default function RecordButton({ isRecording, onStart, onStop }) {
  return (
    <button
      onClick={isRecording ? onStop : onStart}
      aria-label={isRecording ? "Arrêter l'enregistrement" : "Démarrer l'enregistrement"}
      className={`w-16 h-16 rounded-full flex items-center justify-center
                  transition-colors active:scale-95
                  ${isRecording ? "bg-record" : "bg-ink"}`}
    >
      <span
        className={`block ${
          isRecording ? "w-5 h-5 rounded-sm" : "w-6 h-6 rounded-full"
        } bg-white`}
      />
    </button>
  );
}
