# Myco Labs Gujarat Product Website Design

**Project:** Myco Labs website  
**Current direction:** Gujarat-wide premium 3D product website  
**Updated:** 2026-05-11

## Inspiration Direction

Primary design reference: Awwwards `We Enable | Digital Engineers`.

The useful pattern is not to copy its visuals directly. The adaptation is a premium digital-engineering feel for manufacturing: a responsive dark interface, a custom Three.js hero, product-focused interaction tabs, and sequenced reveal animation that makes the service menu feel like a connected growth system.

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

- `Company Profile Website`: one clean page with company intro, products, WhatsApp, Google Maps, and inquiry buttons.
- `Product Catalogue Website`: product categories, product cards, photos, specs, and quote buttons.
- `SEO Growth Website`: stronger website with SEO pages, analytics, lead paths, and better product discovery.

### Catalogue Building

- `PDF Product Catalogue`: polished shareable product catalogue.
- `Category-wise Product Catalogue`: catalogue divided by product type so buyers find items faster.
- `WhatsApp Mini Catalogue`: short mobile-friendly catalogue for quick buyer sharing.

### WhatsApp Bots & Automation

- `WhatsApp Catalogue Bot`: shares product categories, catalogue links, and inquiry buttons.
- `WhatsApp Auto Reply Bot`: shares catalogue links and common answers.
- `Inquiry Collection Bot`: collects product, quantity, location, and callback details.

### Marketplace & Search Growth

- `IndiaMART Listing Improvement`: better listings, photos, descriptions, and inquiry path.
- `Google Business Profile Improvement`: profile cleanup, photos, services, posts, and review path.
- `SEO Improvement Starter`: search-ready page titles, descriptions, local keywords, and structure.

### Simple Software Tools

- `Lead Follow-up Automation`: reminders so serious buyers are not forgotten.
- `Lead Tracker Dashboard`: simple dashboard or sheet for buyer follow-up.
- `Quote Request Tool`: structured inquiry form for quote details.
- `Review Request Automation`: WhatsApp-ready flow for Google review requests.

## Interaction Design

- Hero uses a fixed full-screen Three.js product-orbit scene.
- Hero includes `Interactive growth system` focus tabs for Websites, Catalogues, WhatsApp, Growth, and Tools.
- Product tabs control the active content and steer the 3D focus.
- Hero focus tabs also update the product detail area and the Three.js active beam/panel.
- On mobile, products behave as an accordion: tapping a product opens its details directly below that product, not below the full list.
- Package Maker replaces fixed public amounts:
  - Visitors select Website, Catalogue, WhatsApp Bot, IndiaMART, Google Business Profile, SEO, and Automation Tool.
  - Visitors see a `Selected package includes` list so the package is obvious before opening WhatsApp.
  - The site suggests `Starter Digital Pack`, `Catalogue Growth Pack`, `Automation Growth Pack`, or `Full Digital Presence Pack`.
  - CTA: `Discuss this package on WhatsApp`.
- Cards, tabs, and sections use subtle reveal, hover, and active-state animation.
- The hero headline, copy, CTA, chips, and Three.js scene animate in the first view.
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
- Hero interactive growth tabs are visible and clickable.
- Package Maker has default selections and returns `Full Digital Presence Pack`.
- Package Maker shows selected default items, including Website and Google Business Profile.
- Three.js canvas is nonblank and animated on desktop and mobile.
- No horizontal scroll at desktop or mobile test sizes.
- Build, smoke test, and visual test pass.
