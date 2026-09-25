import NoteCard from "./NoteCard.jsx";

// Présentationnel : ne connaît rien de la source des notes,
// il boucle simplement sur ce qu'on lui donne (SRP + faible couplage).
export default function NoteList({ notes, emptyMessage }) {
  if (notes.length === 0) {
    return (
      <p className="text-sm text-muted text-center py-12">{emptyMessage}</p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
}
