import { useNavigate } from "react-router-dom";
import { useRecorder } from "../hooks/useRecorder.js";
import { useSpeechToText } from "../hooks/useSpeechToText.js";
import { useNotes } from "../hooks/useNotes.js";
import { enrichNote } from "../services/api.js";
import RecordButton from "../components/recorder/RecordButton.jsx";
import Waveform from "../components/recorder/Waveform.jsx";

// Conteneur : c'est le SEUL endroit qui connaît l'orchestration complète
// enregistrement -> transcription -> enrichissement IA -> sauvegarde.
// Chaque étape est déléguée à un module dédié à une seule responsabilité
// (useRecorder, useSpeechToText, enrichNote, useNotes.createNote) :
// RecordPage se contente de les faire collaborer (SRP respecté à chaque niveau).
export default function RecordPage() {
  const navigate = useNavigate();
  const recorder = useRecorder();
  const speech = useSpeechToText();
  const { createNote } = useNotes();

  const handleStart = () => {
    recorder.start();
    speech.start();
  };

  const handleStop = async () => {
    const texteTranscrit = await speech.stop();
    const audioBlob = await recorder.stop();
    const texte = texteTranscrit || "(transcription indisponible)";

    let enrichissement = { categorie: "autre", resume: "", tags: [], taches: [] };
    try {
      enrichissement = await enrichNote(texte);
    } catch (err) {
      // On garde quand même la note brute même si l'IA échoue (résilience)
      console.error(err);
    }

    const note = {
      id: crypto.randomUUID(),
      titre: texte.slice(0, 40) || "Nouvelle note",
      texteTranscrit: texte,
      audioBlob,
      dateCreation: new Date().toISOString(),
      dateAffichee: "à l'instant",
      ...enrichissement,
    };

    await createNote(note);
    navigate(`/notes/${note.id}`);
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 gap-6">
      <p className="text-sm text-muted">
        {recorder.isRecording ? "Enregistrement en cours..." : "Prêt à enregistrer"}
      </p>

      <Waveform levels={recorder.levels} />

      <p className="text-sm text-center text-muted min-h-[3rem] px-4">
        {speech.transcript || "La transcription apparaîtra ici en direct."}
      </p>

      <RecordButton
        isRecording={recorder.isRecording}
        onStart={handleStart}
        onStop={handleStop}
      />

      {recorder.error && (
        <p className="text-xs text-record">{recorder.error}</p>
      )}
      {!speech.isSupported && (
        <p className="text-xs text-muted text-center px-6">
          La transcription en direct n'est pas supportée par ce navigateur ;
          un service externe pourra être utilisé en différé.
        </p>
      )}
      {speech.error && (
        <p className="text-xs text-record text-center px-6">
          Erreur de reconnaissance vocale : {speech.error}
          {speech.error === "network" &&
            " (connexion internet requise pour la transcription Chrome)"}
          {speech.error === "not-allowed" &&
            " (permission micro refusée pour la reconnaissance vocale)"}
        </p>
      )}
    </div>
  );
}
