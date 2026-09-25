import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="w-full border-b border-line bg-paper/95 backdrop-blur sticky top-0 z-10">
      <div className="max-w-md md:max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-base font-medium text-ink">
          Notes vocales
        </Link>

        {/* Navigation horizontale, visible seulement à partir de md (desktop/tablette) */}
        <nav className="hidden md:flex gap-6 text-sm text-muted">
          <Link to="/" className="hover:text-ink">Mes notes</Link>
          <Link to="/enregistrer" className="hover:text-ink">Enregistrer</Link>
        </nav>
      </div>
    </header>
  );
}
