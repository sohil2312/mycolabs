# Myco Labs Gujarat Product Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Revise the Myco Labs website into a Gujarat-wide premium 3D product website with animated product tabs and a package maker.

**Architecture:** Keep the existing Vite + vanilla JavaScript + Three.js app. Content lives in structured data, UI rendering stays in `src/main.js`, visual polish stays in `src/styles.css`, and WebGL behavior stays in `src/three/sporeNetwork.js`.

**Tech Stack:** Vite, JavaScript modules, Three.js, Playwright.

---

## Task 1: Baseline Safety

**Files:** `.gitignore`, git history.

- [x] Initialize git in `/Users/mufasa/Documents/mycolabs`.
- [x] Ignore generated folders: `node_modules/`, `dist/`, `test-artifacts/`, `.superpowers/`, `.DS_Store`.
- [x] Commit the existing site before product edits with message `chore: baseline 3d website`.

## Task 2: TDD Coverage

**Files:** `tests/site-smoke.test.mjs`, `tests/visual-check.mjs`.

- [x] Update smoke test to require Gujarat-wide copy, product categories, product tabs, package maker defaults, and no old public offer text.
- [x] Run smoke test before production edits and verify it fails against the baseline.
- [x] Update visual test to click product tabs, verify package maker, and keep desktop/mobile canvas checks.

## Task 3: Product And Package Content

**Files:** `index.html`, `src/data/services.js`, `src/main.js`.

- [x] Replace city-cluster hero copy with Gujarat-wide manufacturer positioning.
- [x] Replace old services with Website Building, Catalogue Building, WhatsApp Bots & Automation, Marketplace & Search Growth, and Simple Software Tools.
- [x] Add simple product names and short explanations.
- [x] Remove fixed public amounts from UI data and rendered sections.
- [x] Add Package Maker checkboxes and bundle result logic.

## Task 4: Animation And UI Upgrade

**Files:** `src/styles.css`, `src/three/sporeNetwork.js`.

- [x] Replace the original spore-only scene with a product-orbit Three.js scene.
- [x] Add `setFocus(productId)` so product tabs steer the 3D focus.
- [x] Keep mobile animation active with reduced geometry.
- [x] Add richer tab, card, package-maker, reveal, hover, and active-state styling.
- [x] Preserve `prefers-reduced-motion` and `?verifyCanvas=1` support.

## Task 5: Documentation And Verification

**Files:** `docs/visual-asset-prompts.md`, `docs/superpowers/specs/2026-05-11-mycolabs-3d-website-design.md`, this plan.

- [x] Update website design documentation to match the current Gujarat-wide product strategy.
- [x] Update optional visual prompts for website, catalogue, WhatsApp bot, marketplace/search, and automation visuals.
- [x] Run final `npm run build`.
- [x] Run final `npm run test:smoke`.
- [x] Run final `npm run test:visual`.
- [ ] Commit implementation with message `feat: revise myco labs product website`.
