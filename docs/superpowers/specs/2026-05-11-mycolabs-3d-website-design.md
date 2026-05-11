# Myco Labs Gujarat Product Website Design

**Project:** Myco Labs website  
**Current direction:** Gujarat-wide premium 3D product website  
**Updated:** 2026-05-11

## Goal

Build a fast, premium, highly interactive single-page website for Myco Labs that sells simple digital growth products to manufacturers across Gujarat.

The site should not position Myco Labs as serving only one city cluster. It should present a clear product menu around websites, catalogues, WhatsApp bots, automation tools, IndiaMART improvement, Google Business Profile improvement, and SEO starter work.

## Positioning

- Main headline: `Digital growth tools for Gujarat manufacturers`.
- Trust message: `Built for manufacturers across Gujarat`.
- Tone: practical, premium, clear, and owner-friendly.
- Language: simple English with Gujarati + English communication as a trust point.
- No public amounts or fixed public tiers.

## Product Menu

### Website Building

- `Starter Website`: one clean page with company intro, products, WhatsApp, Google Maps, and inquiry buttons.
- `Catalogue Website`: product categories, product cards, photos, specs, and quote buttons.
- `Growth Website`: stronger website with SEO pages, analytics, lead paths, and better product discovery.

### Catalogue Building

- `PDF Sales Catalogue`: polished shareable product catalogue.
- `Category Catalogue`: catalogue divided by product type so buyers find items faster.
- `WhatsApp Mini Catalogue`: short mobile-friendly catalogue for quick buyer sharing.

### WhatsApp Bots & Automation

- `WhatsApp Auto Reply Bot`: shares catalogue links and common answers.
- `Lead Follow-up Automation`: keeps inquiries organized with reminders.
- `Order/Inquiry Form Flow`: collects product, quantity, location, and callback details.

### Marketplace & Search Growth

- `IndiaMART Improvement`: better listings, photos, descriptions, and inquiry path.
- `Google Business Profile Improvement`: profile cleanup, photos, services, posts, and review path.
- `SEO Starter Pack`: search-ready page titles, descriptions, local keywords, and structure.

### Simple Software Tools

- `Lead Tracker`: simple dashboard or sheet for buyer follow-up.
- `Quote Request Tool`: structured inquiry form for quote details.
- `Review Request Tool`: WhatsApp-ready flow for Google review requests.

## Interaction Design

- Hero uses a fixed full-screen Three.js product-orbit scene.
- Product tabs control the active content and steer the 3D focus.
- Package Maker replaces fixed public amounts:
  - Visitors select Website, Catalogue, WhatsApp Bot, IndiaMART, Google Business Profile, SEO, and Automation Tool.
  - The site suggests `Starter Digital Pack`, `Catalogue Growth Pack`, `Automation Growth Pack`, or `Full Digital Presence Pack`.
  - CTA: `Discuss this package on WhatsApp`.
- Cards, tabs, and sections use subtle reveal, hover, and active-state animation.
- Mobile keeps the Three.js scene visible with reduced node count and simpler layout.
- `prefers-reduced-motion` is respected.

## Visual Direction

- Derive the brand feel from `website and logos/image.png` and `public/image.png`.
- Use premium dark green/black, emerald glow, fine grid texture, glass panels, and crisp typography.
- Avoid complicated product names, heavy remote animation libraries, and copied platform UI.
- Keep the homepage usable first; animation supports understanding rather than hiding content.

## Acceptance Criteria

- No public UI text limits the offer to one city cluster.
- No public fixed amounts are shown.
- Old compliance/payroll/loan products are not part of the website offer.
- Product tabs are visible and clickable.
- Package Maker has default selections and returns `Full Digital Presence Pack`.
- Three.js canvas is nonblank and animated on desktop and mobile.
- No horizontal scroll at desktop or mobile test sizes.
- Build, smoke test, and visual test pass.
