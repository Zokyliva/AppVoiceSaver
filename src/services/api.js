// --- Façade (Facade Pattern) ---
// Ce module cache les détails de communication réseau (fetch, headers,
// gestion d'erreurs HTTP) derrière une fonction simple : enrichNote(texte).
// Les composants n'ont jamais besoin de savoir COMMENT on parle au backend.

export async function enrichNote(texte) {
  const response = await fetch("/api/enrich", {
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
