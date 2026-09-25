# Frontend — Notes vocales (React + Vite + Tailwind, mobile-first)

## Approche mobile-first

Toutes les classes Tailwind de base ciblent le petit écran. Les préfixes
`md:` ajoutent des styles uniquement à partir des écrans moyens/larges
(ex : navigation en bas sur mobile, dans le header sur desktop).

## Patrons de conception utilisés

| Patron | Où | Pourquoi |
|---|---|---|
| **Repository** | `services/db.js` | Isole tout l'accès à IndexedDB derrière des fonctions simples (`addNote`, `getAllNotes`...). Le reste de l'app ignore comment/où les notes sont stockées. |
| **Facade** | `services/api.js` | Cache les détails réseau (fetch, headers, erreurs HTTP) derrière une fonction unique `enrichNote(texte)`. |
| **Strategy** | `hooks/useSpeechToText.js` | Deux implémentations interchangeables de transcription (Web Speech API supportée / non supportée), toutes deux conformes à la même interface `{ start, stop }`. |
| **Container / Présentationnel** | `pages/*` vs `components/*` | Les pages orchestrent l'état et les effets ; les composants ne font qu'afficher des props, sans logique métier. |
| **Custom Hook** | `hooks/useRecorder.js`, `hooks/useNotes.js`, `hooks/useSpeechToText.js` | Chaque hook encapsule un seul domaine de logique réutilisable, découplé du rendu JSX. |

## Principes SOLID appliqués

- **S — Single Responsibility** : chaque hook/service/composant a une seule raison de changer (ex : `useRecorder` ne gère que l'audio, jamais la transcription ni le stockage).
- **O — Open/Closed** : `useSpeechToText` peut accueillir une nouvelle stratégie de transcription (ex: appel à une API Whisper) sans modifier le code existant, juste en ajoutant une nouvelle fonction `createXxxStrategy()`.
- **L — Liskov Substitution** : n'importe quelle stratégie de transcription respectant l'interface `{ start, stop }` peut remplacer une autre sans casser `useSpeechToText`.
- **I — Interface Segregation** : les hooks n'exposent que ce dont les composants ont réellement besoin (`useRecorder` n'expose pas de détails internes comme l'`AudioContext`).
- **D — Dependency Inversion** : les composants dépendent d'abstractions (`services/db.js`, `services/api.js`, callbacks de `RecordButton`) et non d'implémentations concrètes (IndexedDB brut, fetch brut).

## Lancer le projet

```bash
npm install
npm run dev
```

Le proxy Vite redirige `/api/*` vers `http://localhost:4000` (backend Express, à lancer séparément).
