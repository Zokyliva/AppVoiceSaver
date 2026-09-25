// --- Façade (Facade Pattern) ---
// Ce module cache les détails de communication réseau (fetch, headers,
// gestion d'erreurs HTTP) derrière une fonction simple : enrichNote(texte).
// Les composants n'ont jamais besoin de savoir COMMENT on parle au backend.

// En local, VITE_API_URL n'est pas défini : les requêtes passent par le
// proxy Vite (vite.config.js) vers localhost:4000, en relatif ("/api/...").
// En production, VITE_API_URL pointe vers l'URL Vercel du backend déployé,
// car frontend et backend sont deux domaines Vercel distincts.
const API_BASE = import.meta.env.VITE_API_URL || "";

export async function enrichNote(texte) {
  const response = await fetch(`${API_BASE}/api/enrich`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texte }),
  });

  const payload = await response.json();

  if (!response.ok || !payload.success) {
    throw new Error(payload.error || "Erreur lors de l'analyse de la note.");
  }

  return payload.data;
  // Forme attendue :
  // { categorie, resume, tags, taches, dateEcheance }
}
