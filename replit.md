# My Paisa HQ - Indian Finance Calculator Suite

## Overview
A professional Indian finance calculator website with 9 fully working tools. Built with React + TypeScript + Tailwind CSS + Recharts. All calculations are client-side (no database needed).

## Architecture
- **Frontend-only calculators** - No backend API calls needed for calculations
- **Single-page app** with wouter routing
- **Mobile-first** responsive design with saffron/orange accent (#FF6B00 / HSL 24 100% 50%)

## Project Structure
```
client/src/
├── App.tsx              # Main app with all routes
├── components/
│   ├── layout.tsx       # Navbar + Footer wrapper
│   ├── breadcrumb.tsx   # Breadcrumb with optional parent level
│   ├── result-card.tsx  # Reusable result display with copy button
│   └── ui/              # Shadcn UI components
├── data/
│   ├── hra-cities.ts    # 19 Indian cities with metro/non-metro HRA data
│   ├── salary-lpa.ts   # 16 CTC levels (3 LPA to 1.5 Crore)
│   └── sip-goals.ts    # 7 financial goals with target/duration/returns
├── lib/
│   ├── formatters.ts    # Indian number formatting (lakhs/crores), clipboard
│   ├── pay-matrix.ts    # 7th CPC pay matrix data (Levels 1-18)
│   ├── queryClient.ts   # TanStack Query setup
│   └── utils.ts         # Tailwind merge utility
├── pages/
│   ├── home.tsx         # Landing page with tool cards
│   ├── pay-commission.tsx  # 8th Pay Commission calculator
│   ├── gratuity.tsx     # Gratuity calculator
│   ├── salary.tsx       # In-hand salary / CTC calculator
│   ├── hra.tsx          # HRA exemption calculator
│   ├── hike.tsx         # Salary hike calculator
│   ├── income-tax.tsx   # Income tax FY 2025-26
│   ├── sip.tsx          # SIP returns calculator
│   ├── loan-vs-sip.tsx  # Loan vs SIP comparison
│   ├── goal-sip.tsx     # Goal-based top-up SIP calculator
│   ├── hra-hub.tsx      # Hub: HRA calculator by city (19 cities)
│   ├── hra-city.tsx     # Detail: HRA calculator for specific city
│   ├── salary-hub.tsx   # Hub: Salary calculator by CTC (16 levels)
│   ├── salary-lpa.tsx   # Detail: Salary calculator for specific CTC
│   ├── sip-hub.tsx      # Hub: SIP calculator by goal (7 goals)
│   └── sip-goal.tsx     # Detail: SIP calculator for specific goal
```

## 9 Calculators
1. `/8th-pay-commission` - 8th CPC salary with fitment factor
2. `/gratuity` - Gratuity with tax exemption + 5-year eligibility warning
3. `/salary` - CTC to in-hand salary (old vs new regime), PF capped at ₹21,600/yr
4. `/hra` - HRA exemption under 10(13A)
5. `/hike` - Salary hike forward/reverse calculator
6. `/income-tax` - FY 2025-26 income tax with slab breakup
7. `/sip` - SIP returns with step-up and chart
8. `/loan-vs-sip` - Loan prepayment vs SIP investment
9. `/goal-sip` - Goal-based top-up SIP (inflation-adjusted target, reverse-calc starting SIP)

## Programmatic SEO Pages (45 new URLs)
- **HRA by City** — `/hra-calculator` hub + `/hra-calculator/:city` (19 cities). Metro (50%): Mumbai, Delhi, Kolkata, Chennai. Non-metro (40%): Bangalore, Hyderabad, Pune, etc.
- **Salary by CTC** — `/salary-calculator` hub + `/salary-calculator/:lpa` (16 levels from 3 LPA to 1.5 Crore). Full salary breakdown with regime comparison.
- **SIP by Goal** — `/sip-calculator` hub + `/sip-calculator/:goal` (7 goals: 1-crore, retirement, child-education, house-down-payment, emergency-fund, financial-freedom, car-purchase).
- Each detail page has: pre-filled inputs, working calculator, nearby/related links for internal linking, 3-level breadcrumbs, unique JSON-LD, server-side SEO injection.
- Invalid slugs redirect to hub page via wouter's `<Redirect>`.

## SEO Infrastructure
- **Server-side SEO injection** (`server/seo-data.ts`) - Injects per-page title, meta tags, JSON-LD schemas, and noscript FAQ content into raw HTML before browser receives it. This ensures non-JS crawlers (LLM pipelines, Bing) see all content without executing JavaScript.
- **SEOHead component** (`components/seo-head.tsx`) - Client-side meta tag updates via DOM manipulation (works alongside server-side injection)
- **JSON-LD Schemas**: Every calculator page has WebApplication, FAQPage, and BreadcrumbList schemas. Homepage has Organization, WebSite, and ItemList schemas. Injected both server-side (in raw HTML) and client-side.
- **FAQ Sections** (`components/faq-section.tsx`) - 5 FAQs per calculator targeting "People Also Ask" queries, rendered in Accordion
- **Breadcrumbs** (`components/breadcrumb.tsx`) - "Home > Calculator Name" with BreadcrumbList schema
- **Related Tools** (`components/related-tools.tsx`) - 3 cross-links per calculator for internal link equity
- **LLM Discovery** - `client/public/llms.txt` (overview) and `client/public/llms-full.txt` (complete FAQ reference) for AI system discovery
- **IndexNow** - `server/indexnow.ts` auto-submits all 55 URLs (10 calculators + 45 programmatic SEO pages) to Bing/Yandex/etc on every production startup. Key file: `client/public/2eff04eeb1374409835369730a484489.txt`. Manual trigger: `POST /api/submit-indexnow`
- **Twitter Cards** - twitter:card, twitter:title, twitter:description in index.html
- **Open Graph** - og:title, og:description, og:url, og:type, og:site_name
- **Sitemap** - `client/public/sitemap.xml` with lastmod dates and changefreq
- **Robots.txt** - `client/public/robots.txt` with sitemap reference
- **Domain**: mypaisahq.com — all canonical/OG URLs reference this domain
- **Blog**: User uses Typeflo at mypaisahq.com/blog; "Knowledge Hub" links externally

## Key Features
- Real-time calculations (update on every input change)
- Indian number system formatting (lakhs/crores)
- Copy result button on each calculator
- Fully responsive design
- Area/bar charts via Recharts
- No database or API needed
- Input validation: min=0 on all fields, min=1 on tenure/duration fields to prevent divide-by-zero
- Gratuity shows eligibility warning for < 5 years service
- Salary breakdown separates earnings and deductions for clear math
