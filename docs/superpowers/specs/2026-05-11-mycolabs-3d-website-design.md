# Myco Labs 3D Website Design Spec

**Date:** May 11, 2026  
**Project:** Myco Labs website  
**Direction selected:** Option 1 - A2-first premium 3D sales engine  
**Status:** Design spec for user review before implementation

---

## 1. Objective

Build a fast, premium, highly interactive single-page website for Myco Labs that uses Three.js and refined UI animation to sell the A2 Manufacturer Digital Presence Pack first, while still presenting the wider Myco Labs product range.

The site should feel like a top-tier brand experience without becoming slow, vague, or decorative. Its job is to make Gujarat manufacturers understand that Myco Labs can upgrade their buyer-facing digital presence through catalogs, websites, WhatsApp, IndiaMART, Google Business Profile, and adjacent business-support services.

---

## 2. Inputs Reviewed

### Local project context

- `MycoLabs_Master_Progress.md`
- `MycoLabs_Follow_Up_Tracker.md`
- `website and logos/image.png`

The folder does not currently contain an app scaffold, `package.json`, `index.html`, Vite config, or source directory.

### Logo/theme reference

`website and logos/image.png` is a 1536 x 1024 PNG showing:

- Dark premium background.
- Emerald green glowing spore mark.
- Navy/black lowercase `myco labs` wordmark.
- Soft industrial/premium atmosphere.

The website should derive its color and motion language from this asset, not restart the brand identity.

### Field/reference research

The reference pass looked at current B2B industrial and premium interactive patterns:

- Pixerts: industrial web design positioning, technical buyer clarity, RFQ outcome framing.
- Bootstrap Creative: manufacturer websites as technical sales tools, not static brochures.
- Windmill Strategy: modern industrial sites need trust, differentiation, and buyer research support.
- Scale-wise: premium SaaS/agency motion language and animation-as-explanation.
- MDN WebGL guidance: mobile WebGL must control memory, draw calls, pixel ratio, and GPU work.

### UI Pro Max output

The `/uipro` design-system search recommended:

- Pattern: immersive/interactive experience.
- Style: liquid glass, but controlled due to performance/contrast risk.
- Typography: Satoshi / General Sans style; use Manrope as brand-compatible fallback.
- Animation guidance: smooth morphing, dynamic blur, and premium transitions.
- UX guidance: accessible names for controls, `transform`/`opacity` animations, lazy loading, visible hover/focus states, reduced-motion support.

---

## 3. Positioning

### Primary message

Digital presence for Gujarat manufacturers.

### Primary offer

A2 Manufacturer Digital Presence Pack.

### Supporting range

The site should also show the wider product roadmap:

- A1 Google Business Profile Boost.
- A2 Manufacturer Digital Presence Pack.
- Compliance Docs Pack.
- HR/Payroll Compliance.
- Loan/CMA/Project Report support, marked as conditional pending bank-permission rules.

### Client-facing language rule

Do not mention AI as a service or selling point. The public positioning is local presence, practical buyer-facing assets, craft, and banking/business literacy.

---

## 4. Information Architecture

Single-page landing site with anchored sections.

### 4.1 Header

Purpose: fast orientation and CTA access.

Content:

- Myco Labs logo/wordmark.
- Anchor links: Services, A2 Pack, Process, Packages, Contact.
- Primary CTA: WhatsApp Inquiry.

Behavior:

- Fixed or floating header.
- Transparent/glass treatment over hero.
- Shrinks or gains stronger background after scroll.
- Mobile collapses to compact menu or simplified CTA bar.

### 4.2 Hero - 3D Spore Network

Purpose: premium first impression and immediate A2 positioning.

Content:

- Eyebrow: `Myco Labs / Idar + Himatnagar`
- H1: `Digital presence for Gujarat manufacturers`
- Supporting copy: B2B catalogs, websites, WhatsApp catalogs, IndiaMART, and Google Business Profile upgrades for manufacturers who need better buyer trust.
- CTA 1: WhatsApp inquiry.
- CTA 2: View A2 Pack.
- Trust strip: `Catalogs`, `Websites`, `WhatsApp`, `IndiaMART`, `GBP`.

3D concept:

- Full-bleed Three.js canvas behind/alongside hero content.
- A glowing emerald spore sphere expands into a network of nodes.
- Nodes represent deliverables and services.
- Pointer/touch interaction slightly attracts nodes and brightens nearby links.
- The scene continues to move subtly without distracting from text.

Mobile:

- Three.js remains present.
- Fewer nodes and connections.
- Lower particle count.
- Reduced camera movement.
- Text remains dominant and readable.

### 4.3 What Myco Labs Builds

Purpose: include the wide product range requested by the user.

Cards:

1. A1 - Google Business Profile Boost.
2. A2 - Manufacturer Digital Presence Pack.
3. Compliance Docs Pack.
4. HR/Payroll Compliance.
5. Loan/CMA/Project Report, conditional.
6. Industrial WhatsApp Catalog pilot, optional/conditional.

Behavior:

- Interactive cards with hover/tap state.
- A2 card is visually emphasized.
- Each card uses a short buyer-facing outcome, not internal jargon.
- On mobile, a lightweight mini-network or animated spore marker appears in this section so 3D is not hero-only.

### 4.4 A2 Pack Deep Dive

Purpose: explain the main paid offer clearly.

Deliverables:

- PDF Sales Catalog.
- Single-page Website.
- WhatsApp Business Catalog.
- IndiaMART Listing Optimization.
- Google Business Profile Setup.

Interaction:

- Desktop: horizontal or radial interactive layout connected to the 3D network visual.
- Mobile: stacked cards with tap-to-expand details.
- Each deliverable gets one short sentence and a practical benefit.

### 4.5 Before/After Transformation

Purpose: show why manufacturers need the service.

Before:

- Old PDF/profile.
- Weak/no website.
- Half-set WhatsApp catalog.
- IndiaMART dependency.
- Google listing not optimized.

After:

- Buyer-ready catalog.
- Fast website.
- WhatsApp inquiry path.
- Cleaner marketplace profile.
- Better Google trust signals.

Interaction:

- Desktop: animated comparison slider or two-state toggle.
- Mobile: segmented control or stacked before/after cards.

### 4.6 Process Timeline

Purpose: reduce uncertainty and make the service feel operationally mature.

Steps:

1. Discovery.
2. Plant visit and content gathering.
3. Photography and catalog copy.
4. Catalog/website production.
5. WhatsApp and GBP setup.
6. Handover and follow-up.

Behavior:

- Scroll-triggered line animation.
- No overcomplicated parallax.
- Timeline remains readable on mobile.

### 4.7 Packages

Purpose: show commercial clarity.

Cards:

- Standard - Rs 12,000.
- Premium - Rs 18,000, highlighted as recommended.
- Export - Rs 25,000.

Notes:

- Premium should be visually preferred.
- Use concise bullets only.
- CTA on every card: WhatsApp inquiry.

### 4.8 Local Trust / Why Myco Labs

Purpose: make the premium website feel grounded and credible.

Content:

- Idar + Himatnagar focus.
- Gujarat manufacturers.
- Gujarati + English comfort.
- Banking background as trust signal.
- WhatsApp-first communication.
- No unnecessary website until the business case is clear.

### 4.9 Final CTA

Purpose: close with a simple action.

Copy direction:

- `Send your business name and product category.`
- Supporting copy: Myco Labs will review the current Google/IndiaMART/website presence and suggest the right pack.

CTA:

- WhatsApp inquiry.
- Optional email link once Google Workspace is ready.

---

## 5. Visual System

### Color

Use the existing Myco Labs brand:

- Emerald accent: `#10B981`.
- Dark text/navy: `#0F172A`.
- Light text: `#F8FAFC`.
- Dark site background: near-black and deep navy variations.
- Supporting neutrals: slate, graphite, muted cyan/green highlights.

Avoid:

- Purple-blue SaaS gradients as the dominant theme.
- Beige/brown palettes.
- Generic rainbow neon.
- Bright white page sections that break the premium dark visual system.

### Typography

Preferred:

- Manrope for brand consistency.
- General Sans or Satoshi-like fallback if available.

Rules:

- No negative letter spacing.
- No viewport-width font scaling.
- Hero text can be large, but service cards and controls must use compact, readable type.

### Surfaces

- Dark glass panels with visible borders.
- 8px or less border radius on cards unless a specific repeated item benefits from slight rounding.
- Thin emerald glows used sparingly.
- Industrial grid/noise texture as a subtle background, not a decorative blob.

### Icons

- Use lucide icons if a framework package is installed.
- Otherwise use simple inline SVG icons.
- No emoji as UI icons.

---

## 6. Motion and 3D System

### Three.js scenes

Use one shared 3D concept:

- Spore core.
- Network nodes.
- Connecting lines.
- Service labels in HTML overlay, not 3D text.

Desktop hero scene:

- 60-120 nodes maximum.
- Animated core sphere.
- Node pulses.
- Pointer influence.
- Slow camera drift.
- No heavy shadow maps.

Mobile hero scene:

- 24-48 nodes maximum.
- Pixel ratio capped.
- Fewer links.
- Simpler material.
- Reduced camera movement.

Secondary mobile 3D moment:

- Reuse the same scene logic or a very small canvas in the services section.
- It should show that 3D is present beyond the first viewport without adding a second heavy engine.

### UI animation

Use:

- Scroll reveal via Intersection Observer.
- Transform and opacity transitions.
- Magnetic CTA only on pointer-capable desktop.
- Card hover with border/glow shift.
- Smooth section progress indicator if inexpensive.

Avoid:

- Animating layout properties.
- Infinite bouncing decorative elements.
- Heavy post-processing.
- Scroll hijacking.
- Text overlap during animation.

### Reduced motion

If `prefers-reduced-motion: reduce`:

- Stop continuous Three.js animation or reduce it to static render.
- Disable scroll reveal movement.
- Preserve content, CTAs, and layout.

---

## 7. Technical Architecture

### Recommended stack

Vite with either:

- Vanilla JS modules, preferred for speed and simplicity.
- React only if component complexity becomes useful.

Dependencies:

- `three`.
- Optional: `lucide-react` only if React is chosen.

No backend is required for the first version.

### File structure target

```text
package.json
index.html
src/
  main.js
  styles.css
  data/
    services.js
  three/
    sporeNetwork.js
  utils/
    motion.js
public/
  image.png
docs/
  visual-asset-prompts.md
```

The exact structure may adjust during implementation, but the Three.js logic should stay isolated from page content logic.

---

## 8. Content Requirements

The site must include these service groups:

- A1 Google Business Profile Boost.
- A2 Manufacturer Digital Presence Pack.
- A2 deliverables: PDF catalog, website, WhatsApp catalog, IndiaMART optimization, GBP setup.
- Compliance Docs Pack.
- HR/Payroll Compliance.
- Conditional Loan/CMA/Project Report support.
- Optional Industrial WhatsApp Catalog pilot.

It must include these business facts:

- Myco Labs.
- `mycolabs.in`.
- Gujarat manufacturer focus.
- Idar + Himatnagar local advantage.
- Gujarati + English comfort.
- No AI positioning.

---

## 9. Asset Plan

### Required for first build

- Existing logo/theme image: `website and logos/image.png`.
- Procedural Three.js visuals.
- CSS-generated texture/grid.

### Not required for first build

No generated images or videos are required for the first implementation because the premium visual identity can be built from the logo, Three.js, typography, and dark UI system.

### Optional generated asset prompts

If the user wants richer future assets, create `docs/visual-asset-prompts.md` with prompts for:

- Abstract emerald manufacturer network background.
- Gujarat factory floor hero still.
- Premium catalog mockup.
- WhatsApp catalog phone mockup.
- Short looping hero video fallback.

These should be optional and should not block the first fast website.

---

## 10. Performance Requirements

Required:

- Static site builds successfully.
- Canvas is nonblank on desktop and mobile.
- No horizontal scroll at 375px.
- Pixel ratio capped for Three.js.
- No heavy shadow maps on mobile.
- Text content is real HTML.
- Images below fold lazy-load if any are added.
- Canvas resizes correctly.
- No per-frame object allocation in the render loop where avoidable.
- WebGL cleanup on page lifecycle where practical.

Targets:

- First usable content appears quickly on localhost.
- Three.js should feel smooth on a typical phone.
- Desktop scene can be richer but must not block reading or CTA use.

---

## 11. Accessibility Requirements

- All buttons and links have accessible names.
- Focus states are visible.
- Color contrast must be readable against dark surfaces.
- Canvas must be decorative or have an accessible text equivalent.
- CTAs are normal links/buttons, not canvas-only interactions.
- `prefers-reduced-motion` is respected.

---

## 12. Verification Plan

Before claiming implementation complete:

1. Run dependency install/build commands.
2. Start local dev server.
3. Open desktop viewport and verify:
   - Hero 3D canvas renders.
   - Text is readable.
   - CTAs work.
   - No obvious overlap.
4. Open mobile viewport and verify:
   - 3D animation is present.
   - Layout has no horizontal scroll.
   - Header/CTA remains usable.
   - Text does not overflow buttons/cards.
5. Inspect console for critical errors.
6. Run a lightweight automated DOM/canvas check if browser automation is available.
7. Confirm all required service/product groups are visible.

---

## 13. Out of Scope for First Build

- CMS.
- Blog.
- Authentication.
- Database.
- Payment collection.
- Real inquiry backend.
- Heavy generated video.
- Client portfolio case studies until real client work exists.
- Mentioning AI as a public service.

---

## 14. Open Implementation Choices

The implementation plan should decide:

1. Vanilla JS vs React after checking desired component complexity.
2. Whether to copy `website and logos/image.png` into `public/` or reference it from the existing folder.
3. Whether to create optional `docs/visual-asset-prompts.md` immediately or only if assets become necessary.
4. Exact WhatsApp destination number and `wa.me` link format, unless the user provides the final number.
