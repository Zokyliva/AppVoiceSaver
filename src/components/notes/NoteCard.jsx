import { Link } from "react-router-dom";
import TagBadge from "./TagBadge.jsx";

// Présentationnel : reçoit une note en props, ne fait aucun appel réseau
// ni accès à IndexedDB. La séparation Container/Présentationnel permet de
// changer le stockage ou la source de données sans toucher à ce fichier.
export default function NoteCard({ note }) {
  return (
    <Link
      to={`/notes/${note.id}`}
      className="block rounded-2xl border border-line bg-white/60 p-4
                 active:scale-[0.98] transition-transform
                 md:p-5"
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-medium truncate md:text-base">
          {note.titre}
        </h3>
        <span className="text-xs text-muted shrink-0 ml-2">
          {note.dateAffichee}
        </span>
      </div>
      <p className="text-sm text-muted line-clamp-2">
        {note.resume || note.texteTranscrit}
      </p>
      {note.categorie && (
        <div className="mt-2">
          <TagBadge label={note.categorie} categorie={note.categorie} />
        </div>
      )}
    </Link>
  );
}
