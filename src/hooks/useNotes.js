import { useCallback, useEffect, useState } from "react";
import * as notesRepository from "../services/db.js";

// --- Custom Hook Pattern + SRP ---
// useNotes a une seule responsabilité : exposer l'état "liste de notes"
// et les actions pour la faire évoluer. Il ne sait rien du rendu (JSX),
// ni du détail de stockage (ça, c'est le rôle de db.js).
export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const all = await notesRepository.getAllNotes();
    setNotes(all);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createNote = useCallback(
    async (note) => {
      await notesRepository.addNote(note);
      await refresh();
    },
    [refresh]
  );

  const editNote = useCallback(
    async (id, changes) => {
      await notesRepository.updateNote(id, changes);
      await refresh();
    },
    [refresh]
  );

  const removeNote = useCallback(
    async (id) => {
      await notesRepository.deleteNote(id);
      await refresh();
    },
    [refresh]
  );

  return { notes, loading, createNote, editNote, removeNote, refresh };
}
