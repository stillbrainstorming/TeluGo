# Paluku

**Learn Telugu. Understand it. Speak it.**

Paluku is an English-first Telugu-learning progressive web app for beginners. It combines a structured starter curriculum, Telugu script with Roman transliteration, practical vocabulary, short quizzes, and guided real-life conversation scenarios.

## Included in this release

- Responsive React + TypeScript web app
- Beginner lessons with vocabulary, sentence examples, and interactive quizzes
- Telugu script, Roman transliteration, and English meanings
- Searchable course vocabulary and a saved-word notebook
- Guided conversations and browser speech playback when a Telugu voice is available
- Local progress, lesson completion, preferences, and learning streaks
- PWA manifest, app icon, versioned service-worker cache, and offline app-shell fallback
- GitHub Actions build validation and GitHub Pages deployment workflow

## Run locally

Requires Node.js 20 or compatible.

```bash
npm install
npm run dev
```

Create and preview a production build:

```bash
npm run build
npm run preview
```

## Deploy

Merging changes into `main` triggers `.github/workflows/deploy.yml`, which builds the app for the `/TeluGo/` GitHub Pages project path and deploys the `dist` directory. The repository's Pages deployment source must be set to **GitHub Actions**. The expected public URL is:

`https://stillbrainstorming.github.io/TeluGo/`

The normal CI workflow also runs on pull requests and pushes to the working branch.

## Current boundaries

This is a functional MVP, not a complete commercial language-learning platform. Learner progress is stored in the browser on the current device; account sign-in and cross-device sync are not included. Speech playback uses the browser/device speech synthesis voice and does not provide pronunciation scoring or reviewed native-speaker recordings. The initial Telugu lesson content should be reviewed by a fluent native speaker before it is treated as production-approved. There is not yet a backend, analytics service, automated end-to-end test suite, or account recovery flow.

## Project structure

- `src/App.tsx` — application views and learning interactions
- `src/data.ts` — lesson, vocabulary, exercise, and conversation seed content
- `src/style.css` — responsive visual design
- `public/manifest.webmanifest` — installable app metadata
- `vite.config.ts` — build-time generation of a versioned service worker with hashed assets precached
- `.github/workflows/ci.yml` — build validation
- `.github/workflows/deploy.yml` — GitHub Pages deployment
