# Myco Labs Mobile Performance Fix Plan

Source reports:
- `site_review/pagereview.txt` points to the mobile PageSpeed report: https://pagespeed.web.dev/analysis/https-mycolabs-gold-vercel-app/6g20wm515e?form_factor=mobile
- `site_review/lighthouse.json` reports Performance 82, Accessibility 88, Best Practices 100, SEO 100.
- Live URL checked: https://mycolabs-gold.vercel.app

## 1. Top 10 Performance Issues

1. `public/image.png` is 2.0 MB and is loaded as a barely visible fixed page texture through `src/styles.css` `body::before`. Lighthouse estimates 1,777 KiB image savings.
2. Google Fonts are loaded through CSS `@import` in `src/styles.css`, creating a critical chain: HTML -> CSS -> `fonts.googleapis.com` -> `fonts.gstatic.com`.
3. The production HTML preloads the Three.js chunk because `src/main.js` statically imports `src/three/sporeNetwork.js`; Lighthouse reports 53 KiB unused JavaScript from the Three chunk.
4. WebGL starts immediately on mobile even though it is decorative, adding GPU work before the user interacts.
5. Lighthouse Speed Index is 17.7 s, mostly affected by delayed visual completion after first render.
6. Time to Interactive is 8.3 s. The JavaScript is not huge, but decorative Three.js work competes with early mobile responsiveness.
7. Reported TTFB inside Lighthouse is 10.17 s. The live Vercel response now returns cache HIT, so this is partly hosting/cache variability, not only code.
8. `backdrop-filter`, `filter`, `mix-blend-mode`, and large fixed layers in `src/styles.css` increase mobile paint cost.
9. Multiple entrance animations run on first view (`h1`, hero copy, hero actions, trust chips, reveal elements), which can delay perceived stability on low-end mobile.
10. The hero canvas uses antialiasing and device pixel ratio scaling in `src/three/sporeNetwork.js`, increasing mobile GPU memory and rendering cost.

## 2. Top 10 Mobile UI/UX Issues

1. Product category controls use `aria-selected` on plain buttons, which Lighthouse flags as invalid ARIA.
2. `index.html` gives `.product-tabs` `role="tablist"`, but the rendered mobile accordion contains panels inside it, which violates required tablist child roles.
3. Some mobile touch targets are below the 44px guideline: `.nav-cta`, `.button`, and `.hero-focus-tab` are reduced in the `max-width: 560px` rules.
4. Hero focus controls become three narrow columns on small phones, making labels and tap zones feel cramped.
5. Hover transforms still apply to touch devices, which can make taps feel jumpy.
6. The mobile page loads decorative visual systems before core content interaction is needed.
7. Fixed header plus smooth scrolling can feel heavy on mobile when jumping between sections.
8. The Product section starts immediately after the hero on mobile with dense cards, making the page feel long.
9. Package options use hidden checkboxes inside large labels, which is good, but focus styling only targets keyboard focus on the hidden input.
10. The site depends on decorative canvas for personality, but touch users need content and CTAs to respond first.

## 3. Exact Files Causing Problems

- `public/image.png`: 2.0 MB decorative texture served as `/image.png`.
- `src/styles.css`: Google Font `@import`, mobile touch target reductions, fixed background image, paint-heavy filters/backdrop blur, hover transforms, first-view animations.
- `index.html`: `role="tablist"` on a container that is not a valid tablist after mobile panels are rendered; no font preconnect/preload hints.
- `src/main.js`: static import of `src/three/sporeNetwork.js`, causing Three.js to be part of initial module graph.
- `src/three/sporeNetwork.js`: immediate WebGL scene creation, animation loop, antialiasing, and mobile pixel ratio work.
- `src/ui/products.js`: emits invalid `aria-selected` on plain product buttons.
- `tests/visual-check.mjs`: currently expects `aria-selected`, so it should move with the ARIA fix.

## 4. What To Fix First

1. Stop loading `public/image.png` on mobile. It is decorative and is the largest payload by far.
2. Remove render-blocking CSS `@import` for Google Fonts and load the font from `index.html` with preconnect and non-blocking stylesheet loading.
3. Change product category controls from fake tabs to accordion-style buttons using `aria-pressed`; remove invalid `role="tablist"`.
4. Make mobile touch targets at least 44px and add `touch-action: manipulation`.
5. Move Three.js to a dynamic import and skip the decorative WebGL animation on small coarse-pointer devices unless the test `verifyCanvas` query is present.

## 5. What Can Be Ignored For Now

- The Lighthouse TTFB spike should not drive code changes yet because the live Vercel headers show a cached response. Re-test after deployment.
- Full image format conversion can wait if mobile stops requesting the image. A compressed desktop texture can be a medium fix.
- Full CSS architecture rewrite can wait.
- Replacing Three.js entirely should wait; it is part of the current brand identity.
- Public pricing/content changes are unrelated to this performance pass.

## 6. Quick Wins Under 30 Minutes

- Move Google Font loading out of CSS `@import`; add preconnect and non-blocking font stylesheet in `index.html`.
- Disable the decorative `/image.png` background on mobile; keep it only for larger screens.
- Remove `role="tablist"` and replace product `aria-selected` with `aria-pressed`.
- Increase mobile tap targets to at least 44px and add `touch-action: manipulation`.
- Disable hover lift transforms on touch devices.
- Dynamically import Three.js and skip it on small touch devices while keeping it on desktop and in `verifyCanvas` test mode.

## 7. Medium Fixes Under 2 Hours

- Create a compressed `public/image.webp` or `public/image.avif` desktop texture and use CSS `image-set()`.
- Reduce WebGL mobile config further if decorative animation is still needed on tablets.
- Split critical CSS for first viewport and defer non-critical section styles.
- Replace some reveal animations with cheaper opacity-only transitions on mobile.
- Add a small local Lighthouse/PageSpeed summary script so regressions are easier to track.
- Improve visual tests to validate touch target sizes and ARIA state.

## 8. Risky Fixes To Avoid For Now

- Removing Three.js completely. It would change the brand experience too much for this pass.
- Rebuilding the site with another framework or adding performance libraries.
- Replacing the full visual system or section structure.
- Aggressively inlining all CSS or JavaScript, which would make maintenance worse.
- Deleting the hero canvas or product focus controls from desktop.
- Changing business copy, CTA strategy, or service positioning during this technical pass.

## 9. Implementation Status

Completed quick wins:
- Font loading moved from CSS `@import` to `index.html` preconnect + non-blocking stylesheet preload.
- Decorative `/image.png` background disabled on mobile.
- Product category controls changed from invalid tab ARIA to accordion-style `aria-pressed` buttons.
- Mobile/touch targets raised to at least 44px for the main interactive controls.
- Hover lift effects and backdrop filters disabled on touch devices.
- Three.js moved behind a dynamic import and skipped on coarse-pointer devices up to tablet width.

Completed medium fixes:
- Added `public/image.webp`, a compressed 28 KiB desktop texture generated from the 2.0 MiB PNG.
- CSS now uses `image-set()` so desktop browsers prefer WebP and fall back to PNG.
- Further reduced WebGL tablet/mobile config for verification and non-coarse smaller screens.
- Added `npm run report:lighthouse` for summarizing `site_review/lighthouse.json`.
- Visual checks now catch stale `aria-selected`, stale `role="tablist"`, and mobile touch targets below 44px.
- Touch devices now get cheaper opacity-only reveal transitions and no decorative scan animations.
- Below-the-fold sections use `content-visibility: auto` with intrinsic sizing to reduce initial render work.

Still intentionally deferred:
- A full CSS file split. `content-visibility` gives some of the same below-the-fold benefit with lower risk.
- Complete removal of Three.js. Desktop brand animation remains.
- Live PageSpeed re-test after deployment. The current local changes must be deployed before the live report can reflect them.
