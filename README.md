# Wayfarer's Toolkit

A D&D player-tools site: shop generator, monster browser, character sheet,
and homebrew notebook. Styled after D&D Beyond's dark navy / crimson theme.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000

The app works immediately with **no Firebase setup** — character sheets and
homebrew entries save to your browser's localStorage.

## Connecting Firebase (optional, for real persistence across devices)

1. Go to https://console.firebase.google.com and create a project.
2. In the project, go to **Build > Firestore Database > Create database**
   (start in test mode for development).
3. Go to **Project settings > General**, scroll to "Your apps", add a Web app.
4. Copy the config values it gives you into a new `.env.local` file
   (copy `.env.local.example` as a starting point):

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

5. Restart `npm run dev`. Character sheets and homebrew entries will now
   save to Firestore automatically — `lib/storage.js` detects the config
   and switches over with no other code changes needed.

6. Before going live, tighten your Firestore security rules (test mode
   allows anyone to read/write).

## Project structure

```
lib/data/shopData.js     town sizes + shop types + goods pools
lib/data/monsters.js     starter bestiary
lib/shopGenerator.js     town/shop generation logic
lib/storage.js           Firestore <-> localStorage data layer
lib/firebase.js          Firebase init (reads .env.local)
pages/shops              shop generator UI
pages/monsters           monster browser UI
pages/character-sheet    character sheet UI
pages/homebrew           homebrew notebook UI
components/              NavBar, Layout, Panel (shared UI)
```

## Roadmap / not built yet

- **Items** — a dedicated item compendium and equipment system (intentionally
  scoped out for now — shops currently sell from a small built-in goods list).
- User accounts (Firebase Auth) so each player only sees their own characters.
- Loot tables tied to monster CR.
- Homebrew monsters/goods feeding back into the shop and monster generators
  (currently a separate list).
