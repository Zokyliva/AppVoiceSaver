import Header from "./Header.jsx";
import NavBar from "./NavBar.jsx";

// AppShell : un seul rôle, structurer la mise en page (SRP).
// Mobile-first : par défaut (mobile), Header + contenu + barre de nav fixée en bas.
// A partir de md:, la barre du bas disparaît et la navigation passe dans le Header.
export default function AppShell({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Header />
      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-4 pb-24 md:max-w-2xl md:pb-8">
        {children}
      </main>
      <NavBar />
    </div>
  );
}
