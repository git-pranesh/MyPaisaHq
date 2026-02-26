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
│   ├── result-card.tsx  # Reusable result display with copy button
│   └── ui/              # Shadcn UI components
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
│   └── goal-sip.tsx     # Goal-based top-up SIP calculator
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
