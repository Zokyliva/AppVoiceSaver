import { useState } from "react";
import { useNotes } from "../hooks/useNotes.js";
import NoteList from "../components/notes/NoteList.jsx";

// Composant "conteneur" : orchestre l'état (via useNotes) et délègue
// tout l'affichage à NoteList/NoteCard (séparation Container/Présentationnel).
export default function HomePage() {
  const { notes, loading } = useNotes();
  const [filtre, setFiltre] = useState("toutes");

  const categories = ["toutes", "travail", "idée", "personnel", "courses"];
  const notesFiltrees =
    filtre === "toutes" ? notes : notes.filter((n) => n.categorie === filtre);

  return (
    <div>
      <h1 className="text-lg font-medium mb-3">Mes notes</h1>

      {/* Filtres : liste défilante horizontalement sur mobile (mobile-first) */}
      <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 md:mx-0 md:px-0">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFiltre(cat)}
            className={`shrink-0 text-xs px-3 py-1.5 rounded-full border
              ${
                filtre === cat
                  ? "bg-ink text-white border-ink"
                  : "border-line text-muted"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-muted text-center py-12">Chargement...</p>
      ) : (
        <NoteList
          notes={notesFiltrees}
          emptyMessage="Aucune note pour l'instant. Appuyez sur « Enregistrer » pour commencer."
        />
      )}
    </div>
  );
}
