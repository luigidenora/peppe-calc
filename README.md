# InGen Cash-Count 3000

A money-counting app for kids, styled as a retro Jurassic Park-era cash register. Built for **Peppe**, who is learning to count euro notes and coins.

The app reads every denomination aloud in Italian using the Web Speech API, works offline, and is deployed as a static site on GitHub Pages.

## Features

- Click notes (€5 / €10 / €20 / €50) and coins (€0.01 – €2) to add them to the running total
- LCD display reads the total aloud on tap (Italian TTS)
- Wallet window shows the exact denomination breakdown
- Undo last addition or reset everything
- Responsive: full console layout on desktop, handheld layout on mobile

## Getting started

```bash
pnpm install
pnpm dev
```

Build for production:

```bash
pnpm build
```

The output goes to `dist/` and is served from the `/peppe-calc/` base path (configured in `vite.config.ts`).

## Deploy

Pushes to `master` automatically deploy to GitHub Pages via `.github/workflows/deploy.yml`.

## Tech stack

- React + TypeScript
- Vite (via [Vite+](https://vite.plus/))
- All styling is inline CSS — no external CSS framework used in the app
- Web Speech API for Italian text-to-speech

## Image credits

Banknote and coin images are sourced from Wikimedia Commons and used under their respective Creative Commons licences.
