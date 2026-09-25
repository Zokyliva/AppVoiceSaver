import { Routes, Route } from "react-router-dom";
import AppShell from "./components/layout/AppShell.jsx";
import HomePage from "./pages/HomePage.jsx";
import RecordPage from "./pages/RecordPage.jsx";
import NoteDetailPage from "./pages/NoteDetailPage.jsx";

// App ne fait qu'une chose : déclarer les routes.
// Toute la mise en page commune vit dans AppShell (SRP - principe SOLID).
export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/enregistrer" element={<RecordPage />} />
        <Route path="/notes/:id" element={<NoteDetailPage />} />
      </Routes>
    </AppShell>
  );
}
