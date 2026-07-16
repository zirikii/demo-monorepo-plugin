# Build Squiz Demo — Full Marketing Website (squiz.net look-alike)

## Mission

Scaffold a production-quality **Squiz marketing-website clone** for demo purposes that looks and feels like the real `www.squiz.net` site (2026 design: cream/off-white surfaces, deep navy `#001822` ink, mint-green `#96F2A9` accent, Spline Sans headings + Inter body, pill buttons, big rounded cards). This is a UI/UX fidelity demo, not a production app: static content data, no real external services. Body copy must be **original writing on the same themes** — do not reproduce squiz.net text verbatim.

**Deliverable:** a single PR against `main` with a complete, lint-clean, build-passing app that runs locally via `pnpm install && pnpm dev:squiz`, plus a recorded Playwright walkthrough video attached to the PR.

## Company profile

- **Product:** Squiz DXP — a managed-SaaS digital experience platform (CMS + Funnelback enterprise search + Content Intelligence + CDP + DAM + integrations) for large, service-led organizations.
- **Primary users:** digital/marketing teams, content managers, and IT directors in government, higher education, professional/financial services, healthcare, and utilities.
- **Core surfaces to clone:** marketing homepage, product pages (DXP, Funnelback Search, Content Intelligence), capabilities catalog, industries, use cases, customer stories, blog, company pages (about/careers/partnerships/roadmap/demos), contact/book-a-call, security/legal.
- **Dummy-data theme:** enterprise DXP marketing content — universities, councils/agencies, utilities, and professional-services firms as fictionalized customers.

## Repo context

- Repo: `demo-monorepo` (pnpm workspace). Scaffold the new app under `apps/squiz/` and wire it into the root `package.json` scripts (`dev:squiz`, `build:squiz`). `pnpm-workspace.yaml` already globs `apps/*`.
- Use the shared `@demo/ui` package (`cn` class merger + `<DemoRibbon>`), mirroring how `apps/paytm` consumes it.

## Target tech stack (per user instruction: pure React, no Next.js)

| Layer | Technology |
|-------|------------|
| Framework | Vite 6 + React 19 + TypeScript (SPA) |
| Routing | react-router-dom v7 |
| Styling | Tailwind CSS v4 (CSS-first `@theme` config) |
| Fonts | `@fontsource/spline-sans` (headings) + `@fontsource/inter` (body) — self-hosted |
| Icons | lucide-react |
| Shared | `@demo/ui` (`cn`, `DemoRibbon`) |
| Data | Local TypeScript data modules (capabilities, industries, use cases, stories, posts) |
| Tests | Vitest + React Testing Library |
| Video | Playwright walkthrough recorder (mirrors `apps/seek/e2e`) |
| Lint/format | ESLint 9 flat config + Prettier |

Explicitly DO NOT integrate real databases, cloud providers, CMS APIs, OAuth, or payment providers.

## Brand assets

- **Header logo:** the user supplied the official Squiz wordmark SVG inline — commit it as a React component (`SquizLogo`) rendered with `currentColor` so it works on light and dark surfaces.
- **Favicon:** derive a favicon from the logo's "burst" mark (the four path shapes on the left of the wordmark) as an inline SVG favicon.
- The live site is behind Cloudflare; design tokens were extracted from the archived `main.css` (July 2026 snapshot): `--clr-brand-primary: #001822`, accent `#96f2a9` / `hsl(142 81% 77%)`, backgrounds `hsl(40 33% 98%)` / `hsl(45 22% 96%)`, highlight tint `hsl(142 67% 94%)`, blue highlight `hsl(227 100% 50%)`, badge tints (blue/purple/pink/orange), radius card 16px / button 8px / shape 24px, fonts Spline Sans + Inter.

## Design system — match the real UI

- Light cream page background (`hsl(40 33% 98%)`), deep navy text `#001822`.
- Sticky translucent header (blur) with logo, four nav dropdowns (Products, Solutions, Insights, Company & Contact), "Log In" link and mint pill "Book a call" CTA.
- Announcement banner above the header ("✨ NEW Content Intelligence is here! …" style, original copy).
- Mega-menu dropdowns with icon cards and promo columns.
- Hero: huge Spline Sans headline, subcopy, dark-navy pill button (mint text) + secondary outline pill; decorative mint "burst" shapes and line art.
- Alternating product feature sections (badge label, h2, copy, dual CTAs, customer-story callout card).
- Dark navy full-bleed CTA band with mint accent button.
- Rotating industry badges strip; persona tab cards; blog card carousel.
- Footer: dark navy, newsletter form, four link columns, legal row, social icons.
- Buttons: primary = navy bg + mint text (light surfaces) / mint bg + navy text (dark surfaces); secondary = outline pill; radius 8px (use pill radius per current site).
- Cards radius 16px, "shape" radius 24px with asymmetric corner (top-left/bottom-right rounded).

## Application structure

```
apps/squiz/
  index.html  vite.config.ts  tsconfig.json  eslint.config.js  playwright.config.ts
  public/brand/            # favicon
  scripts/                 # (none needed — logo is inline SVG)
  e2e/walkthrough.spec.ts  e2e/helpers.ts
  src/
    main.tsx  App.tsx  index.css
    components/
      brand/SquizLogo.tsx
      layout/ (Header, MegaMenu, MobileMenu, AnnouncementBanner, Footer, PageLayout, ScrollToTop)
      ui/ (Button, Badge, SectionHeading, Accordion, StatCard, LogoStrip, Breadcrumbs)
      home/ (Hero, DifferenceStrip, ProductSpotlight, TestimonialBand, CtaBand, IndustryBadges, PersonaTabs, InsightsCarousel)
      shared/ (PageHero, CapabilityCard, StoryCard, PostCard, CtaSection, FaqSection, ContactForm)
    data/ (nav, capabilities, industries, useCases, stories, posts, personas, faqs, team, jobs, releases)
    pages/ (Home, ProductDxp, ProductSearch, ProductContentIntelligence, Capabilities, CapabilityDetail,
            Industries, IndustryDetail, UseCases, UseCaseDetail, CustomerStories, StoryDetail,
            Blog, BlogPost, About, Careers, Partnerships, Roadmap, Demos, Contact, BookACall,
            Security, Legal, PrivacyPolicy, NotFound)
    lib/cn.ts
    test/ (setup.ts + unit tests)
```

## Pages — detailed requirements (25+ routes)

1. `/` homepage matching the archived section order: banner → hero → "difference" strip → three product spotlights (DXP / Funnelback Search / Content Intelligence) with story callouts → testimonial → dark CTA band → industries badges → persona tabs → insights carousel → footer CTA.
2. `/products/digital-experience-platform`, `/products/squiz-funnelback-search`, `/products/content-intelligence` — hero, feature grids, capability links, FAQ, CTA.
3. `/products/capabilities` index + `/products/capabilities/:slug` for 13 capabilities (content-management, conversational-search, keyword-search, personalization, customer-data-platform, digital-asset-management, component-service, advanced-forms, integrations, optimization, behavioral-analytics, accessibility-auditor, ai-readiness-auditor) — data-driven detail template.
4. `/industries` + `/industries/:slug` (higher-education, government, professional-services, financial-and-insurance-services, healthcare, utilities).
5. `/use-cases` + `/use-cases/:slug` (6 use cases from the live nav).
6. `/customer-stories` + `/customer-stories/:slug` (6+ fictionalized stories with metrics).
7. `/blog` + `/blog/:slug` (8+ original posts on DXP/AI-search/accessibility themes).
8. Company: `/about`, `/careers` (with open roles list), `/partnerships`, `/roadmap` (quarterly columns), `/demos` (video-card grid with fake players), `/contact`, `/book-a-call` (form with success state).
9. `/security`, `/legal`, `/legal/privacy-policy`.
10. 404 catch-all.

## Data layer

- All content in typed `src/data/*.ts` modules; detail pages resolve by slug and render from data (realistic original copy, 25+ blog/story/capability entries combined).
- Forms (contact, book-a-call, newsletter) validate client-side and show success states — no network calls.

## Code quality

TypeScript strict, ESLint clean, build clean, Prettier formatted, accessible (semantic HTML, aria labels, keyboard-navigable menus), responsive (mobile menu), no console errors on happy paths.

## Tests (minimum)

Vitest + RTL: Button variants, Header nav (mega-menu open/close), data integrity (all slugs unique + resolvable), Home renders key sections, capability detail page renders from route param, contact form validation/success.

## Video walkthrough

Playwright chromium recording (1280×800) mirroring `apps/seek/e2e`: cursor overlay, homepage scroll, mega-menu open, product page, capabilities, industry, customer story, blog post, book-a-call form submit. Save the `.webm`, convert to `.mp4` if ffmpeg available, attach to the PR body.

## README

Unofficial demo disclaimer (not affiliated with Squiz), setup instructions, structure tour, scripts, video command.

## Implementation order

1. Prompt file (this doc) 2. Scaffold app + workspace wiring 3. Tokens/global CSS/fonts/logo/favicon 4. Data modules 5. Layout shell (banner/header/mega-menu/footer) 6. Homepage 7. Product pages 8. Capability/industry/use-case/story/blog templates 9. Company/legal pages 10. Tests + lint + build 11. Playwright walkthrough video 12. PR.

## PR requirements

Branch `cursor/squiz-website-demo-3d44`. Run lint, build, test — all pass. Open PR titled **feat: Squiz marketing site demo — pure React SPA (apps/squiz)** with summary, fidelity notes, test plan, walkthrough video, known limitations.

## Constraints

- No lorem ipsum — realistic enterprise-DXP copy, originally written.
- Original body copy only; match structure/layout/design, not verbatim text.
- No real secrets, no real integrations.
- Prefer many small files over monoliths; commit incrementally.
