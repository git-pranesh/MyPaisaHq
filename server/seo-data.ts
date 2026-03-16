interface PageSEO {
  title: string;
  description: string;
  canonical: string;
  jsonLd: object[];
  faqText: string;
}

const SITE = "https://mypaisahq.com";

function webApp(name: string, url: string, desc: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    url,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    description: desc,
  };
}

function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

function breadcrumbSchema(name: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name, item: url },
    ],
  };
}

function faqsToText(faqs: { q: string; a: string }[]): string {
  return faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n");
}

const payCommissionFaqs = [
  { q: "What is the 8th Pay Commission fitment factor?", a: "The fitment factor is the multiplier applied to the current basic pay to determine the revised basic pay under a new pay commission. For the 8th CPC, it is expected to be around 2.28x to 2.86x based on historical trends. The 7th CPC used a fitment factor of 2.57x. The final factor will be decided by the commission after its formation." },
  { q: "When will the 8th Pay Commission be implemented?", a: "The 8th Pay Commission was approved by the Union Cabinet on January 16, 2025 and is expected to be implemented from January 1, 2026. The commission will submit its recommendations before that date, and the government will then decide on the implementation timeline." },
  { q: "Who will benefit from the 8th Pay Commission?", a: "The 8th Pay Commission will benefit approximately 50 lakh central government employees and 65 lakh pensioners. It covers all central government employees across all pay levels (Level 1 to Level 18) under the 7th CPC pay matrix." },
  { q: "How is DA (Dearness Allowance) affected by a new pay commission?", a: "When a new pay commission is implemented, the existing DA is merged into the revised basic pay. This means DA resets to 0% at the time of implementation and then starts accumulating again based on the All India Consumer Price Index (AICPI). Currently, DA under the 7th CPC is around 50%." },
  { q: "How does HRA change with the 8th Pay Commission?", a: "HRA is calculated as a percentage of the new basic pay: 27% for X cities (metros like Delhi, Mumbai), 18% for Y cities, and 9% for Z cities. Since the basic pay increases significantly, the HRA amount also increases proportionally under the 8th CPC." },
];

const gratuityFaqs = [
  { q: "How is gratuity calculated in India?", a: "For employees covered under the Payment of Gratuity Act, the formula is: Gratuity = (Last drawn salary x 15 x years of service) / 26. Here, last drawn salary means Basic Pay + Dearness Allowance. The divisor 26 represents working days in a month. For employees not covered under the Act, the divisor is 30 instead of 26." },
  { q: "What is the minimum service period for gratuity eligibility?", a: "Under the Payment of Gratuity Act, 1972, an employee must complete a minimum of 5 years of continuous service with the same employer to be eligible for gratuity. However, this condition is waived in cases of death or disability of the employee." },
  { q: "Is gratuity taxable in India?", a: "For government employees, the entire gratuity amount is tax-exempt. For private sector employees covered under the Gratuity Act, the tax exemption is limited to the least of: (a) actual gratuity received, (b) 15 days' salary for each completed year, or (c) Rs. 25,00,000. Any amount exceeding this is taxable as per the individual's income tax slab." },
  { q: "What happens to gratuity if months of service exceed 6?", a: "If an employee has completed more than 6 months (i.e., 7 months or more) in the last year of service, the period is rounded up to the next full year. For example, 8 years and 7 months is treated as 9 years for gratuity calculation purposes." },
  { q: "Which organizations are covered under the Payment of Gratuity Act?", a: "The Payment of Gratuity Act applies to every factory, mine, oilfield, plantation, port, and railway company. It also applies to every shop or establishment where 10 or more persons are employed or were employed on any day in the preceding 12 months." },
];

const salaryFaqs = [
  { q: "How to calculate in-hand salary from CTC?", a: "In-hand salary = CTC minus employer PF contribution minus employee PF minus professional tax minus income tax. First, calculate basic salary (typically 40-50% of CTC). Then compute HRA, PF deductions, professional tax, and income tax under your chosen regime. The remaining amount is your monthly in-hand (take-home) salary." },
  { q: "What is the difference between CTC and in-hand salary?", a: "CTC (Cost to Company) is the total amount your employer spends on you annually, including basic pay, HRA, employer PF, insurance, bonuses and other benefits. In-hand salary is what you actually receive in your bank account after all deductions like employee PF, professional tax, and income tax. Typically, in-hand salary is 65-75% of CTC." },
  { q: "What is the PF contribution limit in India?", a: "The statutory PF contribution is 12% of basic salary from both employer and employee. The PF contribution is calculated on basic salary up to a ceiling of Rs. 15,000 per month, which means the maximum PF contribution is Rs. 1,800/month or Rs. 21,600/year." },
  { q: "What is professional tax and how much is deducted?", a: "Professional tax is a state-level tax on income earned through employment or profession. The maximum amount that can be levied is Rs. 2,500 per year. Different states have different slabs — for example, Maharashtra charges Rs. 200/month (Rs. 2,400/year)." },
  { q: "Which tax regime is better — old or new?", a: "The new tax regime (FY 2025-26) offers lower slab rates and no tax up to Rs. 12 lakhs income but does not allow most deductions. The old regime has higher rates but allows deductions under 80C, 80D, HRA, etc. If your total deductions exceed Rs. 3-4 lakhs, the old regime might save more." },
];

const hraFaqs = [
  { q: "How is HRA exemption calculated?", a: "HRA exemption is the minimum of three values: (1) Actual HRA received from employer, (2) 50% of basic salary for metro cities (Delhi, Mumbai, Kolkata, Chennai) or 40% for non-metro cities, and (3) Actual rent paid minus 10% of basic salary. The lowest of these three amounts is your HRA exemption under Section 10(13A)." },
  { q: "What is Section 10(13A) of the Income Tax Act?", a: "Section 10(13A) provides tax exemption on HRA (House Rent Allowance) received by salaried employees. To claim this exemption, you must be a salaried employee receiving HRA, live in a rented accommodation, and actually pay rent." },
  { q: "Can I claim HRA if I live in my own house?", a: "No, you cannot claim HRA exemption if you live in your own house. To claim HRA tax benefit, you must be paying rent for your accommodation. However, if you have a home loan in a different city and pay rent where you work, you can claim both." },
  { q: "Which cities are classified as metro for HRA calculation?", a: "Only four cities are classified as metros: Delhi, Mumbai, Kolkata, and Chennai. For these cities, HRA exemption is calculated at 50% of basic salary. All other cities use 40% of basic salary." },
  { q: "Can I claim HRA under the new tax regime?", a: "No, HRA exemption under Section 10(13A) is not available under the new tax regime (FY 2025-26). If you want to claim HRA exemption, you must opt for the old tax regime." },
];

const hikeFaqs = [
  { q: "How to calculate salary hike percentage?", a: "Salary hike percentage = ((New Salary - Old Salary) / Old Salary) x 100. For example, if your CTC increased from Rs. 10,00,000 to Rs. 12,00,000, the hike percentage is ((12,00,000 - 10,00,000) / 10,00,000) x 100 = 20%." },
  { q: "What is a good salary hike percentage in India?", a: "In India, the average annual salary hike is typically 8-12% for the IT industry. A hike of 15-20% is considered good, while 25%+ is excellent and usually happens when switching companies." },
  { q: "How to calculate new salary after hike?", a: "New Salary = Current Salary x (1 + Hike Percentage / 100). For example, if your current CTC is Rs. 8,00,000 and you receive a 15% hike: New CTC = 8,00,000 x 1.15 = Rs. 9,20,000." },
  { q: "Should I negotiate salary based on CTC or in-hand salary?", a: "Always negotiate based on CTC as it represents total compensation. However, understand the CTC breakup — a high CTC with large variable components may result in lower monthly in-hand salary." },
  { q: "How much hike should I ask when switching jobs in India?", a: "When switching jobs, a standard hike expectation is 30-50% of your current CTC. For experienced professionals in high-demand domains, 50-80% hikes are achievable." },
];

const incomeTaxFaqs = [
  { q: "What are the new income tax slabs for FY 2025-26?", a: "Under the new regime for FY 2025-26: Up to Rs. 4,00,000 — Nil; Rs. 4-8 lakh — 5%; Rs. 8-12 lakh — 10%; Rs. 12-16 lakh — 15%; Rs. 16-20 lakh — 20%; Rs. 20-24 lakh — 25%; Above Rs. 24 lakh — 30%. Standard deduction of Rs. 75,000 is available." },
  { q: "Is there no tax up to Rs. 12 lakhs under new regime?", a: "Yes, effectively there is no tax for income up to Rs. 12,00,000 under the new regime for FY 2025-26 due to the Section 87A rebate of Rs. 60,000." },
  { q: "Which tax regime is better — old or new for FY 2025-26?", a: "The new regime is better if you have minimal deductions (below Rs. 3-4 lakhs). The old regime is better if you claim substantial deductions under 80C, 80D, HRA, home loan interest totaling Rs. 4 lakhs or more." },
  { q: "What is Section 87A rebate?", a: "Section 87A provides a tax rebate for individuals with taxable income below a threshold. Under new regime for FY 2025-26, a rebate of up to Rs. 60,000 is available if taxable income does not exceed Rs. 12,00,000." },
  { q: "What is Health and Education Cess?", a: "Health and Education Cess is a 4% surcharge levied on the total income tax amount (after rebate). It funds healthcare and education initiatives and applies regardless of which tax regime you choose." },
];

const sipFaqs = [
  { q: "How does SIP (Systematic Investment Plan) work?", a: "SIP is a method of investing a fixed amount regularly (usually monthly) in mutual funds. Each month, your SIP amount buys units at the current NAV. Over time, this averages out the cost (rupee cost averaging) and benefits from compounding." },
  { q: "What is step-up SIP and how does it help?", a: "Step-up SIP means increasing your SIP amount by a fixed percentage every year. For example, a 10% step-up on a Rs. 10,000 SIP means investing Rs. 11,000 in year 2, Rs. 12,100 in year 3. A 10% annual step-up over 15 years can result in 50-80% more corpus compared to a flat SIP." },
  { q: "What returns can I expect from SIP in India?", a: "Historical returns from equity mutual funds in India have averaged 12-15% annually over 10+ year periods. Large-cap funds typically deliver 10-12%, mid-cap 12-15%, and small-cap 14-18%. For conservative planning, use 10-12% for equity and 6-8% for debt fund SIPs." },
  { q: "How much should I invest in SIP per month?", a: "A common guideline is to invest at least 20-30% of your monthly income through SIPs. You can start with as little as Rs. 500/month." },
  { q: "Is SIP better than lump sum investment?", a: "SIP is generally better for most investors because it averages purchase costs, enforces discipline, and is easier on the budget. Lump sum can outperform in consistently rising markets, but SIP provides better risk-adjusted returns for most investors." },
];

const loanVsSipFaqs = [
  { q: "Should I prepay my home loan or invest in SIP?", a: "Compare your loan interest rate with expected SIP returns. If SIP returns exceed loan interest (e.g., 12% vs 8.5%), investing is mathematically better. But consider tax benefits on home loan, risk tolerance, and the comfort of being debt-free." },
  { q: "When is prepaying a loan better than SIP?", a: "Prepaying is better when loan interest exceeds expected SIP returns, you want guaranteed savings, you're nearing retirement, or you have high-interest loans like personal loans or credit card debt." },
  { q: "How is EMI calculated for a loan?", a: "EMI = P x R x (1+R)^N / ((1+R)^N - 1), where P = Principal, R = Monthly interest rate (annual/12/100), N = Total months. For example, Rs. 30 lakh at 8.5% for 20 years gives EMI of approximately Rs. 26,036." },
  { q: "What factors should I consider in the loan vs SIP decision?", a: "Consider: interest rate differential, tax benefits (home loan interest under Sec 24(b) up to Rs. 2 lakh), investment horizon, risk appetite, and emergency fund adequacy." },
  { q: "Can I do both — partial loan prepayment and SIP?", a: "Yes, this balanced approach is often best. Use 50% of surplus to prepay loan and invest 50% in SIP. Adjust based on your loan rate and goals." },
];

const goalSipFaqs = [
  { q: "What is a goal-based SIP?", a: "A goal-based SIP reverse-calculates the monthly SIP amount needed to reach a specific financial goal (house, education, retirement) within a set time frame, considering expected returns and inflation." },
  { q: "How does SIP top-up (step-up) work?", a: "SIP top-up means increasing your monthly SIP by a fixed percentage yearly. With 10% top-up on Rs. 10,000, you invest Rs. 11,000 in year 2, Rs. 12,100 in year 3. This significantly reduces the starting SIP needed for your goal." },
  { q: "How does inflation affect my financial goal?", a: "Inflation increases your goal's cost over time. If your goal is Rs. 1 crore today at 6% inflation, it will cost approximately Rs. 2.40 crore in 15 years. This calculator adjusts for inflation automatically." },
  { q: "What return rate should I assume for goal-based SIP?", a: "For equity SIPs with 10+ year horizons, assume 10-12%. For 5-10 years, use 8-10% with balanced funds. For under 5 years, use 6-7% with debt funds. Be conservative." },
  { q: "How much SIP do I need for 1 crore in 15 years?", a: "At 12% returns with no step-up, approximately Rs. 20,000/month. With 10% step-up, start with just Rs. 10,500/month. Accounting for 6% inflation (target Rs. 2.40 crore), you need about Rs. 48,000/month without step-up or Rs. 25,000/month with 10% step-up." },
];

const seoPages: Record<string, PageSEO> = {
  "/": {
    title: "My Paisa HQ - Free Indian Finance Calculators",
    description: "Free Indian finance calculators - 8th Pay Commission, Gratuity, Income Tax, SIP, HRA, Salary Hike, CTC breakdown, Loan vs SIP and Goal-based SIP tools. All free, all real-time.",
    canonical: SITE,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "My Paisa HQ",
        url: SITE,
        logo: `${SITE}/logo-full.svg`,
        description: "Free Indian finance calculators for salary, tax, investment and more.",
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "My Paisa HQ",
        url: SITE,
        description: "9 powerful Indian finance calculators covering salary, tax, investment and more. Designed for Indian professionals.",
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Finance Calculators",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "8th Pay Commission", url: `${SITE}/8th-pay-commission` },
          { "@type": "ListItem", position: 2, name: "Gratuity Calculator", url: `${SITE}/gratuity` },
          { "@type": "ListItem", position: 3, name: "In-Hand Salary / CTC", url: `${SITE}/salary` },
          { "@type": "ListItem", position: 4, name: "HRA Exemption", url: `${SITE}/hra` },
          { "@type": "ListItem", position: 5, name: "Salary Hike", url: `${SITE}/hike` },
          { "@type": "ListItem", position: 6, name: "Income Tax FY 2025-26", url: `${SITE}/income-tax` },
          { "@type": "ListItem", position: 7, name: "SIP Returns", url: `${SITE}/sip` },
          { "@type": "ListItem", position: 8, name: "Loan vs SIP", url: `${SITE}/loan-vs-sip` },
          { "@type": "ListItem", position: 9, name: "Goal-based Top-up SIP", url: `${SITE}/goal-sip` },
        ],
      },
    ],
    faqText: "My Paisa HQ offers 9 free Indian finance calculators: 8th Pay Commission Salary Calculator, Gratuity Calculator, In-Hand Salary/CTC Calculator, HRA Exemption Calculator, Salary Hike Calculator, Income Tax Calculator FY 2025-26, SIP Returns Calculator, Loan vs SIP Comparison, and Goal-based Top-up SIP Calculator. All calculations are real-time, use Indian number formatting (lakhs and crores), and are designed for Indian professionals.",
  },
  "/8th-pay-commission": {
    title: "8th Pay Commission Salary Calculator 2026 - My Paisa HQ",
    description: "Calculate your revised salary under the 8th Pay Commission with expected fitment factor (2.28x-2.86x). Compare old 7th CPC vs new 8th CPC basic pay, DA, HRA and gross salary for all pay levels.",
    canonical: `${SITE}/8th-pay-commission`,
    jsonLd: [
      webApp("8th Pay Commission Salary Calculator", `${SITE}/8th-pay-commission`, "Calculate your revised salary under the 8th CPC with fitment factor, HRA, DA and Transport Allowance for all pay levels."),
      faqSchema(payCommissionFaqs),
      breadcrumbSchema("8th Pay Commission Calculator", `${SITE}/8th-pay-commission`),
    ],
    faqText: faqsToText(payCommissionFaqs),
  },
  "/gratuity": {
    title: "Gratuity Calculator India 2025 - My Paisa HQ",
    description: "Calculate gratuity amount online using the Payment of Gratuity Act formula (15/26). Find tax exemption under Section 10(10), taxable portion, and check 5-year eligibility.",
    canonical: `${SITE}/gratuity`,
    jsonLd: [
      webApp("Gratuity Calculator India", `${SITE}/gratuity`, "Calculate gratuity amount, tax exemption and taxable portion under the Payment of Gratuity Act, 1972."),
      faqSchema(gratuityFaqs),
      breadcrumbSchema("Gratuity Calculator", `${SITE}/gratuity`),
    ],
    faqText: faqsToText(gratuityFaqs),
  },
  "/salary": {
    title: "In-Hand Salary & CTC Calculator FY 2025-26 - My Paisa HQ",
    description: "Calculate your in-hand (take-home) salary from CTC with detailed breakdown of basic pay, HRA, PF, professional tax and income tax. Compare old vs new tax regime side by side.",
    canonical: `${SITE}/salary`,
    jsonLd: [
      webApp("In-Hand Salary & CTC Calculator", `${SITE}/salary`, "Break down your CTC into monthly in-hand salary with PF, HRA, professional tax and income tax for both old and new regime."),
      faqSchema(salaryFaqs),
      breadcrumbSchema("In-Hand Salary / CTC Calculator", `${SITE}/salary`),
    ],
    faqText: faqsToText(salaryFaqs),
  },
  "/hra": {
    title: "HRA Exemption Calculator - Section 10(13A) - My Paisa HQ",
    description: "Calculate HRA exemption under Section 10(13A) of Income Tax Act. Compare actual HRA, 50%/40% of basic salary, and rent minus 10% of basic to find your tax-exempt HRA amount.",
    canonical: `${SITE}/hra`,
    jsonLd: [
      webApp("HRA Exemption Calculator", `${SITE}/hra`, "Calculate HRA exemption under Section 10(13A) for metro and non-metro cities with three-way comparison."),
      faqSchema(hraFaqs),
      breadcrumbSchema("HRA Exemption Calculator", `${SITE}/hra`),
    ],
    faqText: faqsToText(hraFaqs),
  },
  "/hike": {
    title: "Salary Hike Calculator India - My Paisa HQ",
    description: "Calculate your new CTC after a salary hike percentage or find the hike needed to reach a target salary. Compare hike percentages from 5% to 50% with monthly and yearly increase amounts.",
    canonical: `${SITE}/hike`,
    jsonLd: [
      webApp("Salary Hike Calculator", `${SITE}/hike`, "Calculate new salary after a hike percentage or find the hike needed to reach a target CTC."),
      faqSchema(hikeFaqs),
      breadcrumbSchema("Salary Hike Calculator", `${SITE}/hike`),
    ],
    faqText: faqsToText(hikeFaqs),
  },
  "/income-tax": {
    title: "Income Tax Calculator FY 2025-26 (AY 2026-27) - My Paisa HQ",
    description: "Calculate income tax for FY 2025-26 with new tax slabs. Compare old vs new regime side by side with slab-wise breakup, Section 87A rebate, 80C, 80D deductions, HRA exemption and 4% cess.",
    canonical: `${SITE}/income-tax`,
    jsonLd: [
      webApp("Income Tax Calculator FY 2025-26", `${SITE}/income-tax`, "Calculate income tax for FY 2025-26 with slab-wise breakup. Compare old vs new regime with Section 87A rebate, 80C, 80D deductions and cess."),
      faqSchema(incomeTaxFaqs),
      breadcrumbSchema("Income Tax Calculator FY 2025-26", `${SITE}/income-tax`),
    ],
    faqText: faqsToText(incomeTaxFaqs),
  },
  "/sip": {
    title: "SIP Returns Calculator with Step-up - My Paisa HQ",
    description: "Calculate SIP (Systematic Investment Plan) returns with optional annual step-up. Estimate maturity value, total invested amount and wealth gained over time with interactive growth chart.",
    canonical: `${SITE}/sip`,
    jsonLd: [
      webApp("SIP Returns Calculator", `${SITE}/sip`, "Calculate SIP returns with optional step-up (top-up) feature. Visualize investment growth over time with area chart."),
      faqSchema(sipFaqs),
      breadcrumbSchema("SIP Returns Calculator", `${SITE}/sip`),
    ],
    faqText: faqsToText(sipFaqs),
  },
  "/loan-vs-sip": {
    title: "Loan vs SIP Comparison Calculator - My Paisa HQ",
    description: "Should you prepay your home loan or invest in SIP? Compare EMI payments, total interest outflow and SIP returns side by side. Calculate the optimal strategy for your financial situation.",
    canonical: `${SITE}/loan-vs-sip`,
    jsonLd: [
      webApp("Loan vs SIP Comparison Calculator", `${SITE}/loan-vs-sip`, "Compare loan prepayment vs SIP investment. Calculate EMI, total interest, and SIP returns to make smarter financial decisions."),
      faqSchema(loanVsSipFaqs),
      breadcrumbSchema("Loan vs SIP Comparison", `${SITE}/loan-vs-sip`),
    ],
    faqText: faqsToText(loanVsSipFaqs),
  },
  "/goal-sip": {
    title: "Goal-based Top-up SIP Calculator - My Paisa HQ",
    description: "Calculate the monthly SIP needed to reach your financial goal with inflation adjustment and annual step-up. See year-by-year investment summary, corpus growth chart, and inflation-adjusted target amount.",
    canonical: `${SITE}/goal-sip`,
    jsonLd: [
      webApp("Goal-based Top-up SIP Calculator", `${SITE}/goal-sip`, "Calculate the monthly SIP needed to reach your financial goal with inflation adjustment and annual top-up."),
      faqSchema(goalSipFaqs),
      breadcrumbSchema("Goal-based Top-up SIP Calculator", `${SITE}/goal-sip`),
    ],
    faqText: faqsToText(goalSipFaqs),
  },
};

const hraCityData: Record<string, { name: string; isMetro: boolean; hraPercent: number }> = {
  mumbai: { name: "Mumbai", isMetro: true, hraPercent: 50 },
  delhi: { name: "Delhi", isMetro: true, hraPercent: 50 },
  kolkata: { name: "Kolkata", isMetro: true, hraPercent: 50 },
  chennai: { name: "Chennai", isMetro: true, hraPercent: 50 },
  bangalore: { name: "Bangalore", isMetro: false, hraPercent: 40 },
  hyderabad: { name: "Hyderabad", isMetro: false, hraPercent: 40 },
  pune: { name: "Pune", isMetro: false, hraPercent: 40 },
  ahmedabad: { name: "Ahmedabad", isMetro: false, hraPercent: 40 },
  jaipur: { name: "Jaipur", isMetro: false, hraPercent: 40 },
  surat: { name: "Surat", isMetro: false, hraPercent: 40 },
  lucknow: { name: "Lucknow", isMetro: false, hraPercent: 40 },
  nagpur: { name: "Nagpur", isMetro: false, hraPercent: 40 },
  indore: { name: "Indore", isMetro: false, hraPercent: 40 },
  bhopal: { name: "Bhopal", isMetro: false, hraPercent: 40 },
  visakhapatnam: { name: "Visakhapatnam", isMetro: false, hraPercent: 40 },
  patna: { name: "Patna", isMetro: false, hraPercent: 40 },
  vadodara: { name: "Vadodara", isMetro: false, hraPercent: 40 },
  coimbatore: { name: "Coimbatore", isMetro: false, hraPercent: 40 },
  kochi: { name: "Kochi", isMetro: false, hraPercent: 40 },
};

const salaryLpaMap: Record<string, { label: string; ctc: number }> = {
  "3-lpa": { label: "3 LPA", ctc: 300000 },
  "4-lpa": { label: "4 LPA", ctc: 400000 },
  "5-lpa": { label: "5 LPA", ctc: 500000 },
  "6-lpa": { label: "6 LPA", ctc: 600000 },
  "7-lpa": { label: "7 LPA", ctc: 700000 },
  "8-lpa": { label: "8 LPA", ctc: 800000 },
  "9-lpa": { label: "9 LPA", ctc: 900000 },
  "10-lpa": { label: "10 LPA", ctc: 1000000 },
  "12-lpa": { label: "12 LPA", ctc: 1200000 },
  "15-lpa": { label: "15 LPA", ctc: 1500000 },
  "18-lpa": { label: "18 LPA", ctc: 1800000 },
  "20-lpa": { label: "20 LPA", ctc: 2000000 },
  "25-lpa": { label: "25 LPA", ctc: 2500000 },
  "30-lpa": { label: "30 LPA", ctc: 3000000 },
  "40-lpa": { label: "40 LPA", ctc: 4000000 },
  "50-lpa": { label: "50 LPA", ctc: 5000000 },
};

const sipGoalMap: Record<string, { name: string; target: number; duration: number; ret: number }> = {
  retirement: { name: "Retirement Planning", target: 30000000, duration: 30, ret: 12 },
  "house-purchase": { name: "House Purchase", target: 10000000, duration: 7, ret: 12 },
  "child-education": { name: "Child's Education", target: 5000000, duration: 15, ret: 12 },
  "emergency-fund": { name: "Emergency Fund", target: 600000, duration: 3, ret: 7 },
  "car-purchase": { name: "Car Purchase", target: 1200000, duration: 3, ret: 8 },
  vacation: { name: "Dream Vacation", target: 500000, duration: 2, ret: 7 },
  wedding: { name: "Wedding Fund", target: 2000000, duration: 5, ret: 8 },
};

function getDynamicSEO(path: string): PageSEO | null {
  if (path === "/hra-calculator") {
    return {
      title: "HRA Exemption Calculator by City 2025-26 | My Paisa HQ",
      description: "Calculate HRA exemption under Section 10(13A) for 19 Indian cities. Know if your city qualifies for 50% (metro) or 40% (non-metro) HRA exemption and optimize your tax savings.",
      canonical: `${SITE}/hra-calculator`,
      jsonLd: [
        { "@context": "https://schema.org", "@type": "CollectionPage", name: "HRA Exemption Calculator by City 2025-26", url: `${SITE}/hra-calculator` },
        breadcrumbSchema("HRA Calculator by City", `${SITE}/hra-calculator`),
      ],
      faqText: "HRA exemption under Section 10(13A) depends on whether your city is classified as metro (50% of basic) or non-metro (40% of basic). Only Mumbai, Delhi, Kolkata, and Chennai are metros.",
    };
  }

  if (path === "/salary-calculator") {
    return {
      title: "Salary Calculator by LPA 2025-26 — In-Hand Salary at Every CTC | My Paisa HQ",
      description: "Calculate in-hand take-home salary for any CTC from 3 LPA to 50 LPA with PF, professional tax, and income tax under old and new regime.",
      canonical: `${SITE}/salary-calculator`,
      jsonLd: [
        { "@context": "https://schema.org", "@type": "CollectionPage", name: "Salary Calculator by LPA 2025-26", url: `${SITE}/salary-calculator` },
        breadcrumbSchema("Salary Calculator by CTC", `${SITE}/salary-calculator`),
      ],
      faqText: "Calculate in-hand salary from CTC for various salary levels from 3 LPA to 50 LPA with detailed breakdown of basic pay, HRA, PF, professional tax, and income tax.",
    };
  }

  if (path === "/sip-calculator") {
    return {
      title: "SIP Calculator by Goal 2025-26 — Monthly SIP for Every Financial Goal | My Paisa HQ",
      description: "Goal-based SIP calculators pre-configured for retirement, house purchase, child education, emergency fund, car purchase, vacation, and wedding fund.",
      canonical: `${SITE}/sip-calculator`,
      jsonLd: [
        { "@context": "https://schema.org", "@type": "CollectionPage", name: "SIP Calculator by Goal 2025-26", url: `${SITE}/sip-calculator` },
        breadcrumbSchema("SIP Calculator by Goal", `${SITE}/sip-calculator`),
      ],
      faqText: "Goal-based SIP calculators pre-configured for retirement, house purchase, child education, emergency fund, car purchase, vacation, and wedding fund.",
    };
  }

  const hraMatch = path.match(/^\/hra-calculator\/([a-z-]+)$/);
  if (hraMatch) {
    const city = hraCityData[hraMatch[1]];
    if (city) {
      const slug = hraMatch[1];
      return {
        title: `HRA Calculator for ${city.name} 2025-26 | ${city.isMetro ? "Metro" : "Non-Metro"} HRA Exemption | My Paisa HQ`,
        description: `Calculate HRA exemption for ${city.name} under Section 10(13A). ${city.name} is a ${city.isMetro ? "metro" : "non-metro"} city with ${city.hraPercent}% HRA on basic salary.`,
        canonical: `${SITE}/hra-calculator/${slug}`,
        jsonLd: [
          webApp(`HRA Calculator ${city.name}`, `${SITE}/hra-calculator/${slug}`, `Calculate HRA exemption for ${city.name}. ${city.isMetro ? "Metro" : "Non-metro"} city — ${city.hraPercent}% of basic salary.`),
          { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE },
            { "@type": "ListItem", position: 2, name: "HRA Calculator by City", item: `${SITE}/hra-calculator` },
            { "@type": "ListItem", position: 3, name: `HRA Calculator ${city.name}`, item: `${SITE}/hra-calculator/${slug}` },
          ]},
        ],
        faqText: `Q: Is ${city.name} a metro city for HRA?\nA: ${city.isMetro ? `Yes, ${city.name} is a metro city — 50% HRA exemption.` : `No, ${city.name} is non-metro — 40% HRA exemption. Only Mumbai, Delhi, Kolkata, Chennai are metros.`}`,
      };
    }
  }

  const salaryMatch = path.match(/^\/salary-calculator\/([a-z0-9.-]+)$/);
  if (salaryMatch) {
    const lpa = salaryLpaMap[salaryMatch[1]];
    if (lpa) {
      const slug = salaryMatch[1];
      return {
        title: `${lpa.label} In-Hand Salary Calculator 2025-26 | Monthly Take-Home | My Paisa HQ`,
        description: `${lpa.label} CTC (₹${lpa.ctc.toLocaleString("en-IN")}/year) in-hand salary breakdown with PF, professional tax, income tax. Compare old vs new tax regime.`,
        canonical: `${SITE}/salary-calculator/${slug}`,
        jsonLd: [
          webApp(`${lpa.label} Salary Calculator`, `${SITE}/salary-calculator/${slug}`, `Calculate in-hand salary from ${lpa.label} CTC with tax regime comparison.`),
          { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE },
            { "@type": "ListItem", position: 2, name: "Salary Calculator by CTC", item: `${SITE}/salary-calculator` },
            { "@type": "ListItem", position: 3, name: `${lpa.label} Salary`, item: `${SITE}/salary-calculator/${slug}` },
          ]},
        ],
        faqText: `Q: What is the in-hand salary for ${lpa.label} CTC?\nA: For a CTC of ${lpa.label}, the in-hand salary depends on basic salary percentage, PF, professional tax, and tax regime. Use this calculator for exact figures.`,
      };
    }
  }

  const sipMatch = path.match(/^\/sip-calculator\/([a-z0-9.-]+)$/);
  if (sipMatch) {
    const goal = sipGoalMap[sipMatch[1]];
    if (goal) {
      const slug = sipMatch[1];
      return {
        title: `SIP Calculator for ${goal.name} 2025-26 | Monthly Investment Needed | My Paisa HQ`,
        description: `Calculate the monthly SIP needed for ${goal.name}. Target ₹${goal.target.toLocaleString("en-IN")} over ${goal.duration} years at ${goal.ret}% returns with step-up option.`,
        canonical: `${SITE}/sip-calculator/${slug}`,
        jsonLd: [
          webApp(`SIP for ${goal.name}`, `${SITE}/sip-calculator/${slug}`, `Calculate monthly SIP for ${goal.name}. Target: ₹${goal.target.toLocaleString("en-IN")} over ${goal.duration} years.`),
          { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE },
            { "@type": "ListItem", position: 2, name: "SIP Calculator by Goal", item: `${SITE}/sip-calculator` },
            { "@type": "ListItem", position: 3, name: `SIP for ${goal.name}`, item: `${SITE}/sip-calculator/${slug}` },
          ]},
        ],
        faqText: `Q: How much SIP is needed for ${goal.name}?\nA: To reach ₹${goal.target.toLocaleString("en-IN")} over ${goal.duration} years at ${goal.ret}% returns, use this calculator with step-up option.`,
      };
    }
  }

  return null;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function injectSEO(html: string, urlPath: string): string {
  const cleanPath = urlPath.split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";
  const seo = seoPages[cleanPath] || getDynamicSEO(cleanPath);
  if (!seo) return html;

  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escapeHtml(seo.title)}</title>`
  );

  html = html.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${escapeHtml(seo.description)}"`
  );

  html = html.replace(
    /<link rel="canonical" href="[^"]*"/,
    `<link rel="canonical" href="${escapeHtml(seo.canonical)}"`
  );

  html = html.replace(
    /<meta property="og:title" content="[^"]*"/,
    `<meta property="og:title" content="${escapeHtml(seo.title)}"`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"/,
    `<meta property="og:description" content="${escapeHtml(seo.description)}"`
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*"/,
    `<meta property="og:url" content="${escapeHtml(seo.canonical)}"`
  );

  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"/,
    `<meta name="twitter:title" content="${escapeHtml(seo.title)}"`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"/,
    `<meta name="twitter:description" content="${escapeHtml(seo.description)}"`
  );

  const jsonLdScripts = seo.jsonLd
    .map((schema) => `<script type="application/ld+json" data-seo-server="true">${JSON.stringify(schema)}</script>`)
    .join("\n    ");
  html = html.replace("</head>", `    ${jsonLdScripts}\n  </head>`);

  const noscriptContent = `<noscript><div style="max-width:800px;margin:40px auto;padding:0 20px;font-family:system-ui,sans-serif"><h1>${escapeHtml(seo.title)}</h1><p>${escapeHtml(seo.description)}</p><hr/>${seo.faqText.split("\n\n").map(block => {
    const lines = block.split("\n");
    const q = lines[0]?.replace(/^Q: /, "") || "";
    const a = lines[1]?.replace(/^A: /, "") || "";
    return `<h3>${escapeHtml(q)}</h3><p>${escapeHtml(a)}</p>`;
  }).join("")}<hr/><p><a href="https://mypaisahq.com">My Paisa HQ</a> - Free Indian Finance Calculators</p></div></noscript>`;
  html = html.replace('<div id="root"></div>', `<div id="root"></div>${noscriptContent}`);

  return html;
}
