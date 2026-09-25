import { openDB } from "idb";

// --- Repository Pattern ---
// db.js est le SEUL fichier du projet qui connaît IndexedDB.
// Le reste de l'app manipule des notes via ces fonctions, jamais directement
// via l'API IndexedDB. Si on change de moteur de stockage plus tard
// (ex: passer à un backend distant), seul ce fichier change (DIP + OCP).

const DB_NAME = "notes-vocales-db";
const STORE_NAME = "notes";

async function getDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("dateCreation", "dateCreation");
      }
    },
  });
}

export async function addNote(note) {
  const db = await getDb();
  await db.put(STORE_NAME, note);
  return note;
}

export async function updateNote(id, changes) {
  const db = await getDb();
  const existing = await db.get(STORE_NAME, id);
  if (!existing) throw new Error(`Note ${id} introuvable`);
  const updated = { ...existing, ...changes };
  await db.put(STORE_NAME, updated);
  return updated;
}

export async function getAllNotes() {
  const db = await getDb();
  const notes = await db.getAll(STORE_NAME);
  return notes.sort(
    (a, b) => new Date(b.dateCreation) - new Date(a.dateCreation)
  );
}

export async function getNoteById(id) {
  const db = await getDb();
  return db.get(STORE_NAME, id);
}

export async function deleteNote(id) {
  const db = await getDb();
  await db.delete(STORE_NAME, id);
}
