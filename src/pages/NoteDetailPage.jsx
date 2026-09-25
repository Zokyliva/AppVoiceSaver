import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNoteById, deleteNote } from "../services/db.js";
import TagBadge from "../components/notes/TagBadge.jsx";

// Conteneur : charge une note par id et l'affiche.
// Toute la logique de suppression/lecture reste ici ; l'affichage des tags
// est délégué à TagBadge (réutilisation d'un composant présentationnel).
export default function NoteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);

  useEffect(() => {
    getNoteById(id).then(setNote);
  }, [id]);

  if (!note) return <p className="text-sm text-muted text-center py-12">Chargement...</p>;

  const audioUrl = note.audioBlob ? URL.createObjectURL(note.audioBlob) : null;

  const handleDelete = async () => {
    await deleteNote(id);
    navigate("/");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-lg font-medium">{note.titre}</h1>
        <button onClick={handleDelete} className="text-xs text-record">
          Supprimer
        </button>
      </div>

      {audioUrl && (
        <audio controls src={audioUrl} className="w-full mb-4" />
      )}

      {note.resume && (
        <section className="mb-4">
          <h2 className="text-xs font-medium text-muted mb-1">Résumé</h2>
          <p className="text-sm">{note.resume}</p>
        </section>
      )}

      <section className="mb-4">
        <h2 className="text-xs font-medium text-muted mb-1">Transcription</h2>
        <p className="text-sm text-muted">{note.texteTranscrit}</p>
      </section>

      <div className="flex flex-wrap gap-2">
        {note.categorie && <TagBadge label={note.categorie} categorie={note.categorie} />}
        {(note.tags || []).map((tag) => (
          <TagBadge key={tag} label={tag} />
        ))}
      </div>
    </div>
  );
}
