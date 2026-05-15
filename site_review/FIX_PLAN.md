# Myco Labs Mobile Performance Fix Plan

Source reports:
- `site_review/pagereview.txt` points to the original mobile PageSpeed report: https://pagespeed.web.dev/analysis/https-mycolabs-gold-vercel-app/6g20wm515e?form_factor=mobile
- `site_review/lighthouse.json` reported Performance 82, Accessibility 88, Best Practices 100, SEO 100 before the first quick-win pass.
- Live URL checked after deployment: https://mycolabs-gold.vercel.app
- Latest live audit date: May 14, 2026.

## Current Live State

Direct live checks after deployment:
- Live page returns `HTTP/2 200`.
- HTML is 8,079 bytes raw and about 2.4 KB compressed in browser timing.
- Main CSS is 16,535 bytes raw.
- Main JavaScript is 15,590 bytes raw.
- `public/image.webp` is live and returns `image/webp`, 24,920 bytes.
- `public/image.png` is still live and returns `image/png`, 2,081,406 bytes.
- The Three.js chunk exists at about 491 KB raw, but the mobile browser pass did not request it.
- Mobile lab pass reported LCP around 496 ms. LCP element was the hero `h1`.
- Mobile lab pass reported CLS `0`.
- Mobile lab pass found no long tasks.
- Google PageSpeed public API returned `429` from this environment, so the current state is based on direct headers plus a mobile-emulated Chromium pass.

Important current caveat:
- Vercel serves the deployed HTML, CSS, JS, WebP, and PNG with `cache-control: public, max-age=0, must-revalidate`. The edge cache is hitting, but browser caching for versioned static assets is weaker than it should be.

## 1. Top 10 Current Performance Issues

1. Versioned static assets are not getting long browser cache headers. Live `/assets/*.css`, `/assets/*.js`, `/image.webp`, and `/image.png` return `max-age=0, must-revalidate`.
2. `public/image.png` is still a 2.0 MB fallback image. It is not requested in the current mobile pass, but it remains expensive for fallback paths and desktop cache misses.
3. Google Fonts still create third-party requests: one `fonts.googleapis.com` CSS request and multiple `fonts.gstatic.com` Manrope font responses.
4. `#hero-canvas` still exists as a fixed full-screen layer on mobile even when Three.js is skipped. It is pointer-safe, but it is unnecessary DOM and paint surface on touch devices.
5. CSS is still one render-blocking stylesheet. It is small enough for now, but Lighthouse can still flag render-blocking CSS.
6. `.reveal` content starts hidden until JavaScript runs. The current measured pass is fine, but this is fragile on slower devices or if JS is delayed.
7. Desktop still loads a large Three.js chunk after idle. This keeps the brand animation, but it remains the largest JavaScript asset.
8. Paint-heavy styling still exists for larger screens: fixed layers, gradients, shadows, and backdrop filters. Touch devices now reduce some of this, but desktop/tablet paint cost remains.
9. Font weight coverage is broader than the live page really needs. The current Google Fonts request asks for `400;500;600;700;800`.
10. Current PageSpeed score has not been re-run successfully after deployment because the PageSpeed API returned `429` in this environment.

## 2. Top 10 Current Mobile UI/UX Issues

1. The inactive full-screen canvas is still present on mobile. It should be hidden or not rendered for coarse-pointer devices.
2. The first viewport is still dense on small phones: fixed header, WhatsApp CTA, hero heading, hero actions, trust chips, and command panel all appear early.
3. Hero focus controls use a two-column layout on small phones. It is better than the previous cramped layout, but labels can still feel tight.
4. Fixed header plus smooth anchor scrolling can feel heavy on low-end touch devices.
5. Above-the-fold hero content depends on JavaScript reveal initialization for final visibility state.
6. Product accordion cards are content-heavy on mobile, especially after the hero.
7. Package option labels are large and usable, but visible focus state is tied to the hidden checkbox control instead of the whole label.
8. The WhatsApp CTA is clear, but the placeholder phone number should be replaced before real marketing traffic.
9. The custom font improves brand feel, but third-party font loading can cause perceived delay on poor mobile networks.
10. Desktop brand animation is preserved, but touch users should continue getting the fastest static experience.

## 3. Exact Files Causing Remaining Problems

- Missing: `vercel.json` for production cache headers.
- `public/image.png`: 2.0 MB fallback image still deployed.
- `index.html`: requests broad Google Font weights through the Google Fonts stylesheet.
- `src/styles.css`: fixed full-screen `#hero-canvas`, broad styling bundle, reveal defaults, gradients, shadows, and desktop image fallback.
- `src/utils/motion.js`: reveal behavior depends on JavaScript adding `is-visible`.
- `src/main.js`: creates the canvas element in HTML even when `shouldLoadSporeNetwork()` skips the Three.js import.
- `src/three/sporeNetwork.js`: desktop animation remains useful for brand identity but is still the largest JS path.

Already fixed files from the first pass:
- `src/ui/products.js`: product controls now use `aria-pressed` instead of invalid `aria-selected`.
- `index.html`: invalid product `role="tablist"` was removed.
- `src/main.js`: Three.js is now dynamically imported and skipped on small coarse-pointer devices.
- `src/styles.css`: mobile no longer requests the decorative image background, touch targets were improved, and touch devices get cheaper motion.
- `tests/visual-check.mjs`: now checks stale ARIA and mobile touch target regressions.

## 4. What To Fix First

1. Add `vercel.json` cache headers for static assets:
   - `/assets/(.*)` should use `public, max-age=31536000, immutable`.
   - `/image.webp` should use `public, max-age=31536000, immutable`.
   - `/image.png` should use long cache only if it remains deployed.
2. Hide the inactive hero canvas on mobile/touch devices with CSS, or add a `canvas.is-disabled` state when animation is skipped.
3. Compress or replace `public/image.png` so the fallback is not 2.0 MB.
4. Reduce Google Font weights to the smallest practical set, likely `400;700;800`.
5. Make the hero reveal safe without waiting for JavaScript, especially for the first viewport.

## 5. What Can Be Ignored For Now

- Removing Three.js completely. It is part of the desktop brand identity and mobile already skips it.
- Splitting the whole CSS architecture. The current CSS is modest, and `content-visibility` already reduces below-the-fold work.
- Optimizing the 491 KB Three.js desktop chunk before cache headers and image fallback are fixed.
- Rebuilding the website in another framework.
- Adding new performance libraries.
- Chasing the old Lighthouse TTFB number until a fresh PageSpeed run succeeds after deployment.

## 6. Quick Wins Under 30 Minutes

- Add `vercel.json` with immutable cache headers for `/assets/*`, `/image.webp`, and any retained optimized fallback image.
- Add a mobile/touch rule in `src/styles.css`:
  - `@media (pointer: coarse), (max-width: 920px) { #hero-canvas { display: none; } }`
- Reduce the Google Fonts request in `index.html` from `400;500;600;700;800` to the weights actually needed.
- Make the hero section visible by default and keep reveal effects for below-the-fold sections only.
- Add one visual/smoke assertion that mobile does not request the Three.js chunk without `?verifyCanvas`.

## 7. Medium Fixes Under 2 Hours

- Replace `public/image.png` with a compressed fallback file under 250 KB, or remove the PNG fallback if target browsers can rely on WebP.
- Self-host a subsetted Manrope font file and remove Google Fonts network dependency.
- Add a lightweight live performance script that records:
  - status code
  - important cache headers
  - HTML/CSS/JS transfer sizes
  - whether mobile requested the Three.js chunk
- Tune mobile layout density around the hero command panel if real-device testing shows cramped taps.
- Add a Vercel/PageSpeed re-test checklist after every production deploy.

## 8. Risky Fixes To Avoid For Now

- Removing the desktop Three.js animation completely.
- Replacing the visual identity or section structure.
- Adding service workers for caching before simpler Vercel headers are correct.
- Inlining all CSS or JavaScript.
- Moving to a new framework or adding performance tooling libraries.
- Changing business copy, CTA strategy, or service positioning during a technical performance pass.

## 9. Completed First-Pass Fixes

Completed quick wins:
- Font loading moved from CSS `@import` to `index.html` preconnect plus non-blocking stylesheet preload.
- Decorative `/image.png` background disabled on mobile.
- Product category controls changed from invalid tab ARIA to accordion-style `aria-pressed` buttons.
- Mobile/touch targets raised to at least 44px for the main interactive controls.
- Hover lift effects and backdrop filters disabled on touch devices.
- Three.js moved behind a dynamic import and skipped on coarse-pointer devices up to tablet width.

Completed medium fixes:
- Added `public/image.webp`, a compressed 24.9 KB desktop texture generated from the 2.0 MB PNG.
- CSS now uses `image-set()` so desktop browsers prefer WebP and fall back to PNG.
- Further reduced WebGL tablet/mobile config for verification and non-coarse smaller screens.
- Added `npm run report:lighthouse` for summarizing `site_review/lighthouse.json`.
- Visual checks now catch stale `aria-selected`, stale `role="tablist"`, and mobile touch targets below 44px.
- Touch devices now get cheaper opacity-only reveal transitions and no decorative scan animations.
- Below-the-fold sections use `content-visibility: auto` with intrinsic sizing to reduce initial render work.

## 10. Next Implementation Queue

Next quick-win commit: ✅ COMPLETE
1. ✅ Create `vercel.json` static cache headers — already present with immutable headers for `/assets/*`, `/image.webp`, `/image.png`.
2. ✅ Hide `#hero-canvas` on touch/mobile — CSS `display: none` via `@media (pointer: coarse), (max-width: 920px)`.
3. ✅ Reduce Google Font weights — `index.html` already uses `400;700;800` only.
4. ✅ Hero reveal behavior — hero content never used `.reveal`; safe without JS. Also removed `filter: blur(8px)` from `hero-title-in` keyframes to eliminate expensive compositor layer on desktop.
5. ✅ Build passes — `npm run build` clean.
6. ✅ Smoke and visual checks pass — no ARIA regressions, no small touch targets, no horizontal scroll, mobile Three.js skipped.
7. Deploy and verify live headers — pending.

Additionally completed:
- ✅ `public/image.png` compressed to 6 KB (was 2.0 MB).
- ✅ Package option keyboard focus ring expanded to whole card via `:focus-within` on `.package-option`.

Next medium commit:
1. ✅ `public/image.png` already compressed to 6 KB.
2. Consider self-hosting Manrope — still on Google Fonts third-party request.
3. ✅ Live audit script exists at `scripts/live-audit.mjs`.
