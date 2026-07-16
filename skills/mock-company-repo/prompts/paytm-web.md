# Build Paytm Web Demo — Full Consumer Marketing + Payments Site (paytm.com clone)

## Mission

Scaffold a production-quality **Paytm.com UI clone** for demo purposes that looks and feels like the real consumer website at https://paytm.com/ (reference screenshots captured 2026-07-08 and the user-supplied "Paytm ♥ UPI" header logo). This is a UI/UX fidelity demo, not a production app: dummy data, mock flows, local JSON/TS seed modules. No real payments, UPI rails, or external services.

**Deliverable:** a PR against `main` with a complete, lint-clean, build-passing app under `apps/paytm/` that runs locally via `pnpm install && pnpm dev:paytm`, plus a screen-recorded walkthrough video attached to the PR.

## Company profile

- **Product:** Paytm (One97 Communications) is India's leading digital payments platform — BHIM UPI money transfers, mobile/DTH/utility recharges, bill payments, travel and movie ticketing, credit cards, insurance, wealth (Paytm Money), digital gold, and merchant payment devices (QR, Soundbox, POS).
- **Primary users:** Indian consumers paying bills, recharging phones, sending money via UPI, and booking travel/entertainment; plus merchants exploring business payment tools.
- **Core surfaces to clone:**
  1. **Home** — sticky white header with "Paytm ♥ UPI" logo + mega-menu nav; "Recharges & Bill Payments" icon-grid card with UPI-statement side panel; utility quick-pay strips; app-feature promo card row; travel search widget (Flights/Bus/Trains/Intl tabs) with Paytm Travel branding; large UPI "pay anyone" section; 24×7 support ribbon; Credit Cards + Insurance duo cards; Paytm Money section; Paytm for Business section; long-form informational sections; mega-footer with accordion link groups, payment-network icons, and social icons.
  2. **Recharge & bill-payment pages** — dark navy category strip subnav; left-floating white form card (e.g. Prepaid/Postpaid toggle, mobile number, operator, amount) over a full-width blue band; operator tile row; browsable plan cards; FAQs; long-form original SEO-style copy.
  3. **Travel pages** — flight/bus/train search forms with origin/destination/date pickers, special-fare pills, popular routes, offers.
  4. **Financial services pages** — UPI, credit cards, insurance marketplace, personal loans, digital gold, Paytm Money (stocks/MF), each a content-rich marketing page.
  5. **Company pages** — About, Careers (with job listings), Investor Relations (financial results, press releases), Blog, Support/24×7 Help, Security/Trust, Offers.
- **Dummy-data theme:** Indian telecom/utility/travel data — operators (Airtel, Jio, Vi, BSNL, MTNL), DTH providers (Tata Play, Dish TV, d2h, Sun Direct), electricity boards by state, IRCTC-style train names, Indian city flight routes (DEL⇄BOM etc.), Bollywood-flavoured movie titles (fictional), INR pricing, Indian names for testimonials/leadership. All marketing copy must be **original writing** — do not copy Paytm's actual paragraphs.

## Repo context

- Repo: `demo-monorepo` (pnpm workspace, Bitbucket `richard-demo/demo-monorepo`)
- Scaffold the new app at **`apps/paytm/`** and wire it into the workspace: root scripts `dev:paytm` / `build:paytm`, README app table row, and use the shared **`@demo/ui`** package (`cn` class merger re-exported via `src/lib/cn.ts`, `DemoRibbon` rendered in the header/footer area to mark the demo).

## Target tech stack (per user instruction: plain React, NOT Next.js)

| Layer | Technology |
|-------|------------|
| Bundler | Vite 6 |
| Framework | React 19 (SPA) |
| Routing | react-router-dom v7 (client-side routes, `ScrollToTop` on navigate) |
| Language | TypeScript strict |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`, CSS-first `@theme` tokens) |
| Fonts | `@fontsource` self-hosted Inter (Paytm web uses a similar geometric sans; no external hotlinks) |
| Icons | lucide-react + fetched brand PNG/SVG icons |
| Shared pkg | `@demo/ui` (workspace:*) — `cn`, `DemoRibbon` |
| State | Local React state + context (no Redux needed for demo) |
| Data | Typed TS seed modules in `src/data/` (operators, plans, boards, routes, movies, cards, jobs, press releases, FAQs, nav/footer config) |
| Tests | Vitest + React Testing Library + jsdom |
| Lint/format | ESLint 9 flat config + Prettier (repo root config) |

Explicitly DO NOT integrate real payment rails, UPI, databases, OAuth, or any paid provider. All "payments" end in a simulated success dialog labelled as a demo.

## Brand assets — source real files (do this first)

The header must use the **"Paytm ♥ UPI" lockup the user attached** — this is the same asset the live site serves as its header logo.

**Sources (in order):**
1. Header logo (Paytm ♥ UPI): `https://pwebassets.paytm.com/commonwebassets/paytmweb/header/images/logo_new.svg`
2. Footer Paytm logo: `https://pwebassets.paytm.com/commonwebassets/paytmweb/footer/images/paytmLogo.svg`
3. Footer trust/payment icons: `.../footer/images/{help,assurance,trust,visa,mastercard,ruPay,americanExpress,dinerClub,pci,plus}.{svg,png}`
4. Social icons: `.../footer/images/social/{facebook,twitter,youtube,linkedin,instagram}.svg`
5. Header aux icons: `.../header/images/{downloadApp,cross,logoutImg}.svg`
6. Paytm Travel logo: `https://paytmtravel-images-akamai.paytm.com/icons/Paytm_Travel_Logo.svg`
7. Home category icons (assetscdn1.paytm.com `images/catalog/view_item/...`): Mobile Recharge, Electricity, FASTag, DTH, Insurance, Metro, Toll, View All, Broadband/Landline, Loan EMI, travel tab icons (Flights/Bus/Trains/Intl)
8. Favicon: `https://paytm.com/favicon.ico` (retry on 429; fallback: derive from logo mark)

**Required files in `apps/paytm/public/brand/`:** `paytm-upi-logo.svg` (header), `paytm-logo.svg` (footer), `paytm-travel-logo.svg`, `favicon.ico`/`favicon.svg`, `icons/` (category + payment + social icons), `brand-assets.json` manifest, reproducible `scripts/fetch-brand-assets.sh` (curl with browser UA, idempotent). Self-host everything — **no hotlinks** in the UI. If a specific CDN icon 403s, substitute a lucide icon and note it in the manifest.

## Design system — match the real UI

- **Colors:** Paytm Navy `#002970`/`#002E6E` (header nav text, headings, dark subnav strip `#00214E`–`#012B72`), Paytm Cyan `#00BAF2` (primary CTA buttons, links, highlighted words), light body bg `#f4f7fc` / white cards, ink `#101010`, soft gray text `#506d85`, pill borders `#d9e0e8`. Footer bottom stripe: cyan/navy double band.
- **Type:** Inter 400/500/600/700/800; hero headlines ~40–48px bold with navy + cyan two-tone lines; section H2 ~28–32px; body 14–16px.
- **Components:** white rounded-2xl cards with soft shadows on pale blue bg; icon tiles with rounded squircle backgrounds; pill CTAs (cyan filled + navy outline); tabbed travel widget with underline-active tabs; radio pills (One Way/Round Trip, Prepaid/Postpaid); accordion footer groups with `+` toggles; mega-menu dropdowns under a slim white header; dark navy category strip with small white icons+labels on product pages.
- Reusable primitives: `Header` (mega-menu), `CategoryStrip`, `Footer` (accordions + trust row), `SectionHeading`, `PromoCard`, `IconTile`, `Button`, `TextField`, `SelectField`, `RadioPillGroup`, `Tabs`, `Accordion` (FAQ), `Modal` (sign-in / success), `AppStoreBadges`, `SupportRibbon`, `SeoTextBlock`, `PageHero`.

## Application structure (~100+ files)

```
apps/paytm/
  index.html  vite.config.ts  tsconfig.json  eslint.config.js  package.json  README.md
  scripts/fetch-brand-assets.sh
  public/brand/ (logos, favicon, icons/, brand-assets.json)
  src/
    main.tsx  App.tsx (RouterProvider + route table)  index.css (@theme tokens)
    lib/ (cn.ts re-export, format.ts, validators.ts, constants.ts)
    hooks/ (useDocumentTitle, useDisclosure)
    data/ (navigation, footerLinks, operators, rechargePlans, electricityBoards, dthProviders,
           billCategories, travelRoutes, flights, buses, trains, movies, events, upiFeatures,
           creditCards, insuranceProducts, loans, goldRates, moneyProducts, businessProducts,
           offers, jobs, leadership, milestones, financialResults, pressReleases, blogPosts,
           faqs, supportTopics, securityPractices, appHighlights)
    components/
      layout/ (Header, MegaMenu, MobileMenu, CategoryStrip, Footer, FooterAccordion, PageLayout, ScrollToTop)
      ui/ (Button, TextField, SelectField, RadioPillGroup, Tabs, Accordion, Modal, Badge, SectionHeading, IconTile, Stat)
      home/ (RechargesCard, UpiStatementPanel, QuickPayStrip, AppPromoRow, TravelWidget, UpiHero,
             SupportRibbon, DuoPromoCards, MoneySection, BusinessSection, InfoSections)
      recharge/ (RechargeForm, OperatorGrid, PlanBrowser)
      bills/ (BillForm, StateLinkGrid)
      travel/ (FlightSearchForm, BusSearchForm, TrainSearchForm, SpecialFares, RouteChips, SearchResultsList)
      entertainment/ (MovieGrid, EventList)
      finance/ (CardShowcase, ProductFeatureGrid, RateTable, EmiCalculator)
      company/ (LeadershipGrid, MilestoneTimeline, JobList, PressList, ResultCards, BlogGrid)
      shared/ (AppStoreBadges, FaqSection, SeoTextBlock, PageHero, TrustStrip, DownloadAppModal, SignInModal, SuccessModal)
    pages/ (Home, MobileRecharge, ElectricityBill, DthRecharge, FastagRecharge, BroadbandBill, LoanEmi,
            BillPayments hub, Flights, BusTickets, TrainTickets, Movies, Upi, CreditCards, Insurance,
            PersonalLoan, Gold, PaytmMoney, Business, Offers, About, Careers, InvestorRelations, Blog,
            Support, Security, NotFound)
    test/ (setup.ts + component/unit tests)
```

## Pages — detailed requirements (24 routes minimum)

1. `/` Home — every section listed in Core surfaces §1, fully responsive.
2. `/recharge` Mobile Recharge — category strip, prepaid/postpaid form (10-digit validation, operator+circle selects, amount), operator tiles, plan browser cards (data packs/unlimited/talktime tabs), FAQs, original info copy. Submitting opens a **simulated success modal** (DemoRibbon-labelled).
3. `/electricity-bill-payment` — board/state selects + consumer number form; grid of state-wise "Electricity Bill Payment" links; FAQs.
4. `/dth-recharge` — provider tiles (Tata Play, Dish TV, d2h, Sun Direct, Airtel Digital TV), packs, FAQs.
5. `/fastag-recharge` — issuing-bank select + vehicle number form, how-it-works steps, FAQs.
6. `/broadband-bill-payment` — provider select form + popular provider links.
7. `/loan-emi-payment` — lender select + loan account form, reminder pitch.
8. `/bill-payments` — hub grid of every bill category (water, gas, municipal, education fee, etc.).
9. `/flights` — full search form (trip type radio pills, from/to swap, date, traveller class, special fares), popular route chips, offer cards, mock results list after search.
10. `/bus-tickets` — from/to/date search + popular routes + top operators.
11. `/train-tickets` — search + PNR-status mock card + popular trains list.
12. `/movies` — now-showing grid (fictional titles, languages, ratings), events strip, city selector.
13. `/upi` — UPI money-transfer marketing page: hero, feature grid, how-to steps, safety notes, FAQs.
14. `/credit-cards` — card showcase (co-brand style cards with fictional names), benefits comparison, eligibility steps.
15. `/insurance` — categories (bike/car/health/term), plan cards with premiums, claim-support stats.
16. `/personal-loan` — EMI calculator (interactive sliders), eligibility, steps, FAQs.
17. `/gold` — live-ish gold rate card (seeded), buy/sell/SIP pitch, purity assurance.
18. `/paytm-money` — stocks/MF/IPO/NPS feature sections, MTF banner, market-stat strip.
19. `/business` — merchant landing: QR, Soundbox, Card Machine, Payment Gateway product cards + stats.
20. `/offers` — filterable promo/cashback offer cards.
21. `/about-us` — mission, stats, leadership grid, milestone timeline.
22. `/careers` — culture blurb + filterable job list (team/location) from seed data.
23. `/investor-relations` — financial-results cards, stock-exchange filing list, press releases.
24. `/blog` — post grid with categories; `/support` — help topics + grievance escalation ladder; `/security` — trust practices; `*` NotFound.

Every page: `useDocumentTitle`, breadcrumb or hero, at least 3 content sections, FAQ where natural, cross-link CTAs, mobile responsive.

## Mock interactions

- Sign In modal (phone input, demo hint, fake OTP step), Download App modal (QR placeholder built from divs), recharge/bill/travel forms validate then show SuccessModal with entered summary, EMI calculator computes real math from sliders, offers filter client-side, careers filter client-side. No network calls.

## Code quality

TypeScript strict, zero `any`; ESLint + Prettier clean; `pnpm build:paytm` passes; accessible (labels, aria-expanded on accordions/menus, focus-trapped modals, keyboard nav); no console errors; responsive at 375px/768px/1280px.

## Tests (Vitest + RTL, ≥8 files)

format utils (INR currency, phone/consumer validators), EMI math, RechargeForm validation + success flow, FlightSearchForm swap + search, Accordion toggle, Header mega-menu open/close, Footer accordion, route smoke test for all pages (render + heading present).

## README (apps/paytm/README.md)

Unofficial demo disclaimer (not affiliated with Paytm/One97; brand assets from public web assets for visual fidelity only), setup commands, route map, structure tour, data/mock notes, scripts.

## Implementation order

1. Fetch brand assets → `public/brand/` + script  2. Scaffold Vite app + workspace wiring  3. `@theme` tokens + fonts  4. Data modules  5. UI primitives  6. Header/Footer/CategoryStrip shell  7. **Home page (match screenshot)**  8. Recharge + bill pages  9. Travel pages  10. Finance pages  11. Company/content pages  12. Modals + interactions  13. Tests  14. README + lint/build/test green  15. Record demo video walkthrough  16. PR with video attached.

## PR requirements

Branch `cursor/paytm-web-demo-aa79`. Bitbucket PR titled **feat: Paytm web demo — consumer site clone (apps/paytm)** with: summary, fidelity notes vs. paytm.com, route list, test plan, demo walkthrough **video attachment**, known limitations, non-affiliation note.

## Constraints

- Original copy only — never paste Paytm's actual sentences; short functional labels (e.g. "Mobile Recharge") are fine.
- Fictional promo/finance numbers plausible for India (₹ pricing); no real personal data.
- No lorem ipsum. Prefer many small files. Commit incrementally.

**Success criteria:** `pnpm install && pnpm dev:paytm` serves a site that a casual viewer would mistake for paytm.com — real "Paytm ♥ UPI" logo in the header, navy/cyan design language, dense home page, 24+ content-rich routes — with lint/build/tests green and a video-recorded walkthrough attached to the Bitbucket PR.
