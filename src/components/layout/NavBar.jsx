import { NavLink } from "react-router-dom";

// Barre de navigation basse, pensée pour le pouce (mobile-first).
// Cachée dès md: puisque la navigation passe alors dans le Header.
export default function NavBar() {
  const linkClass = ({ isActive }) =>
    `flex flex-col items-center justify-center gap-1 flex-1 py-2 text-xs ${
      isActive ? "text-ink font-medium" : "text-muted"
    }`;

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 bg-paper border-t border-line
                 flex pb-[env(safe-area-inset-bottom)]"
    >
      <NavLink to="/" end className={linkClass}>
        <span>Notes</span>
      </NavLink>
      <NavLink to="/enregistrer" className={linkClass}>
        <span>Enregistrer</span>
      </NavLink>
    </nav>
  );
}
