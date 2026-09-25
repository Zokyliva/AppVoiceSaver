// Composant "présentationnel" pur : aucune logique, uniquement du rendu
// en fonction de ses props (SRP). Facile à tester et à réutiliser partout.
const COLORS = {
  travail: "bg-tag/10 text-tag",
  idée: "bg-blue-500/10 text-blue-700",
  personnel: "bg-emerald-500/10 text-emerald-700",
  courses: "bg-amber-500/10 text-amber-700",
  autre: "bg-line text-muted",
};

export default function TagBadge({ label, categorie = "autre" }) {
  const classes = COLORS[categorie] || COLORS.autre;
  return (
    <span className={`text-xs px-2 py-1 rounded-full ${classes}`}>
      {label}
    </span>
  );
}
