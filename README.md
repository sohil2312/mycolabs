# Myco Labs 3D Website

Static Vite website for Myco Labs, a Gujarat-focused digital growth offer for manufacturers. The site is built with vanilla JavaScript, CSS, and Three.js. It presents website, catalogue, WhatsApp automation, marketplace/search growth, and simple software tool services through an interactive product menu, package maker, and WebGL hero animation.

## Tech Stack

- Vite
- Vanilla JavaScript modules
- Three.js for the fixed hero/product-orbit canvas
- CSS in `src/styles.css`
- Playwright scripts for smoke and visual checks

This is not a Next.js project. There is no `app/`, `pages/`, `components/`, `next.config.*`, `tailwind.config.*`, or `tsconfig.json` in the current repo.

## Local Setup

Install dependencies:

```sh
npm install
```

Run the local dev server:

```sh
npm run dev
```

The dev server binds to `127.0.0.1`. Vite normally serves the site at `http://127.0.0.1:5173/` unless that port is unavailable.

Build production assets:

```sh
npm run build
```

Preview the production build:

```sh
npm run preview
```

Run the smoke check:

```sh
npm run test:smoke
```

Run the visual check:

```sh
npm run test:visual
```

Both test scripts default to `SITE_URL=http://127.0.0.1:5173/`. Start the dev server first, or pass a different URL:

```sh
SITE_URL=http://127.0.0.1:4173/ npm run test:smoke
```

## Project Structure

```text
.
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── public/
│   └── image.png
├── src/
│   ├── main.js
│   ├── styles.css
│   ├── data/
│   │   └── services.js
│   ├── three/
│   │   └── sporeNetwork.js
│   └── utils/
│       └── motion.js
├── tests/
│   ├── site-smoke.test.mjs
│   └── visual-check.mjs
├── docs/
│   └── visual-asset-prompts.md
├── MycoLabs_Master_Progress.md
├── MycoLabs_Follow_Up_Tracker.md
├── dist/
├── test-artifacts/
└── website and logos/
    └── image.png
```

## Key Files

- `index.html` defines the page shell, metadata, semantic sections, navigation, CTAs, and data hook elements used by JavaScript.
- `src/main.js` renders product tabs, product details, package options, process steps, growth cards, and connects UI selections to the Three.js scene.
- `src/data/services.js` stores the current product/service copy, package options, package result labels, process steps, and growth signals.
- `src/three/sporeNetwork.js` builds the WebGL product-orbit animation with Three.js and exposes `setFocus()` and `destroy()` methods.
- `src/utils/motion.js` handles header scroll state and reveal-on-scroll behavior.
- `src/styles.css` contains the complete visual system and responsive layout.
- `public/image.png` is used as the low-opacity page background image in CSS.
- `vite.config.js` configures the production bundle to split `three` into its own manual chunk.

## Current Page Sections

- Hero section with interactive product focus controls and WebGL canvas.
- Products section with tabs for Websites, Catalogues, WhatsApp, Growth, and Tools.
- Package Maker section with selectable package options and a computed package result.
- Process section rendered from `processSteps`.
- Growth section rendered from `growthSignals`.
- Gujarat focus trust section.
- Contact CTA section with WhatsApp links.

## QA And Test Notes

- `tests/site-smoke.test.mjs` checks required sections, expected copy, default package state, canvas visibility, and absence of older forbidden text.
- `tests/visual-check.mjs` verifies desktop and mobile layout, canvas pixels/frame movement, product tab interactions, hero focus interactions, package maker visibility, and screenshot output.
- `test-artifacts/` contains screenshots produced by visual checks.
- `dist/` contains generated production output and is ignored by `.gitignore`.

## Agent Notes

- Do not describe this as a React or Next.js app unless the codebase changes.
- Keep the product copy in `src/data/services.js` aligned with the live sections rendered by `src/main.js`.
- The WhatsApp number is currently a placeholder: `910000000000`.
- Existing project notes list replacing the placeholder WhatsApp number and adding real client product categories as pending work.
- Avoid adding public pricing unless the positioning docs are changed; the current site uses a Package Maker without public amounts.
