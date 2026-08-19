# Wayfarer's Toolkit

A D&D player-tools site: shop generator, monster browser, character sheet,
and homebrew notebook. Styled after D&D Beyond's dark navy / crimson theme.
Available in English and Thai.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000

The app works immediately with **no Firebase setup** — character sheets and
homebrew entries save to your browser's localStorage.

## Language (English / Thai)

The site uses Next.js's built-in i18n routing — no extra dependency needed.
Click the **EN / ไทย** toggle in the top-right of the nav bar to switch;
it swaps the whole UI and keeps you on the same page.

- `lib/i18n/dictionaries.js` — all UI strings for `en` and `th`.
- `lib/i18n/useT.js` — the `useT()` hook (`const { t } = useT()`, then `t("nav.shops")`).
- `components/LanguageSwitcher.js` — the toggle itself.

**What's translated vs. not:** all UI chrome (navigation, headings, buttons,
form labels, status text) is translated. Game *content* — shop good names,
monster stat blocks, homebrew field labels like STR/DEX, preset shop
taglines — stays in English on both locales, since translating D&D
terminology accurately is a separate effort. To add more content
translation later, extend `lib/i18n/dictionaries.js` and reference it from
`lib/data/*.js` the same way `shops.townSizes` and `shops.shopTypes` do.

To add a third language: add a locale to `next.config.js`'s `i18n.locales`,
add a matching dictionary export in `lib/i18n/dictionaries.js`, and add it
to the `DICTS` map in `lib/i18n/useT.js`.

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
lib/data/shopData.js           town sizes + 2 named preset shops per category
lib/data/monsters.js           starter bestiary
lib/data/homebrewCategories.js homebrew categories (Backgrounds, Feats, Magic
                                Items, Monsters, Species, Spells, Subclasses)
                                and their form fields, mirroring D&D Beyond
lib/shopGenerator.js           town/shop generation + restock logic
lib/storage.js                 Firestore <-> localStorage data layer
lib/firebase.js                Firebase init (reads .env.local)
lib/i18n/                      translations + useT() hook
pages/shops                    shop generator UI
pages/monsters                 monster browser UI
pages/character-sheet          character sheet UI
pages/homebrew                 homebrew hub + per-category create/browse UI
components/                    NavBar, Layout, Panel, LanguageSwitcher
```

## Shops

Each category (Blacksmith, Potion Shop, Tavern, Food) has exactly 2
hand-named preset shops (e.g. "Ironhold Forge" and "Cinderforge Armory").
A village shows 1 of the 2 per category; town/dock/city show both. Rerolling
a named shop restocks its inventory (quantities/prices) — it keeps its name
and identity. "Random location" cards are unnamed flavor spots and reroll to
a different one entirely.

## Homebrew

`/homebrew` is a hub page mirroring D&D Beyond's homebrew categories.
Each category (`/homebrew/[category]`) has its own tailored create form and
a saved-entries list — Magic Items included.

## Roadmap / not built yet

- **Items** (equipment compendium, separate from Magic Items homebrew) —
  shops still sell from a small built-in goods list per preset shop.
- NPC generator with quest hooks and player-style ability scores — planned,
  not yet built.
- User accounts (Firebase Auth) so each player only sees their own characters.
- Loot tables tied to monster CR.
- Translating game content (item/monster/spell text) into Thai.
