export interface SalaryLPA {
  slug: string;
  lpaValue: number;
  ctc: number;
  label: string;
  description: string;
  nearbyLpa: string[];
}

export const salaryLpaData: SalaryLPA[] = [
  {
    slug: "3-lpa",
    lpaValue: 3,
    ctc: 300000,
    label: "3 LPA",
    description: "A CTC of 3 LPA (Rs. 3,00,000/year) is a common starting salary for freshers in Tier-2 and Tier-3 cities. At this level, income tax under the new regime is nil, making the in-hand salary relatively close to gross salary after PF and professional tax deductions.",
    nearbyLpa: ["4-lpa", "5-lpa", "6-lpa", "8-lpa"],
  },
  {
    slug: "4-lpa",
    lpaValue: 4,
    ctc: 400000,
    label: "4 LPA",
    description: "A CTC of 4 LPA (Rs. 4,00,000/year) is typical for entry-level roles in IT support, BPO, and administrative positions. Income tax remains nil under the new regime, so take-home is mostly affected by PF and professional tax deductions.",
    nearbyLpa: ["3-lpa", "5-lpa", "6-lpa", "8-lpa"],
  },
  {
    slug: "5-lpa",
    lpaValue: 5,
    ctc: 500000,
    label: "5 LPA",
    description: "At 5 LPA (Rs. 5,00,000/year), you're at a common salary for junior developers, analysts, and graduates with 1-2 years of experience. Income tax under the new regime is zero due to rebate under Section 87A, making it a tax-efficient salary bracket.",
    nearbyLpa: ["4-lpa", "6-lpa", "8-lpa", "10-lpa"],
  },
  {
    slug: "6-lpa",
    lpaValue: 6,
    ctc: 600000,
    label: "6 LPA",
    description: "A CTC of 6 LPA (Rs. 6,00,000/year) is a competitive starting salary for software engineers and MBA graduates from good institutions. Tax liability begins to appear under the old regime, but remains zero under new regime (below 12L taxable).",
    nearbyLpa: ["5-lpa", "8-lpa", "10-lpa", "12-lpa"],
  },
  {
    slug: "8-lpa",
    lpaValue: 8,
    ctc: 800000,
    label: "8 LPA",
    description: "At 8 LPA (Rs. 8,00,000/year), typical for mid-level engineers with 2-4 years experience, the tax impact starts becoming noticeable. This is a key bracket where comparing old vs new tax regime becomes important for optimizing take-home pay.",
    nearbyLpa: ["6-lpa", "10-lpa", "12-lpa", "15-lpa"],
  },
  {
    slug: "10-lpa",
    lpaValue: 10,
    ctc: 1000000,
    label: "10 LPA",
    description: "The aspirational 10 LPA (Rs. 10,00,000/year or 1 crore over 10 years) is a milestone salary for many Indian professionals. At this CTC, understanding the interplay of basic salary percentage, HRA, PF, and tax regime choice becomes critical for maximizing monthly take-home.",
    nearbyLpa: ["8-lpa", "12-lpa", "15-lpa", "20-lpa"],
  },
  {
    slug: "12-lpa",
    lpaValue: 12,
    ctc: 1200000,
    label: "12 LPA",
    description: "At 12 LPA (Rs. 12,00,000/year), the new regime tax rebate limit becomes crucial — taxable income around this threshold determines whether you pay zero tax or start paying 10-15%. A slight change in deductions can significantly impact your tax liability.",
    nearbyLpa: ["10-lpa", "15-lpa", "20-lpa", "25-lpa"],
  },
  {
    slug: "15-lpa",
    lpaValue: 15,
    ctc: 1500000,
    label: "15 LPA",
    description: "A CTC of 15 LPA (Rs. 15,00,000/year) is common for senior developers, team leads, and experienced analysts. At this level, the difference between old and new regime becomes pronounced, and strategic tax planning can save Rs. 30,000-80,000 annually.",
    nearbyLpa: ["12-lpa", "20-lpa", "25-lpa", "30-lpa"],
  },
  {
    slug: "20-lpa",
    lpaValue: 20,
    ctc: 2000000,
    label: "20 LPA",
    description: "At 20 LPA (Rs. 20,00,000/year), you're in a senior professional bracket — tech leads, managers, and specialized roles. Tax planning is essential as combined tax (new regime) reaches Rs. 2.5-3 lakh. The old regime may save more if you have substantial 80C and HRA deductions.",
    nearbyLpa: ["15-lpa", "25-lpa", "30-lpa", "40-lpa"],
  },
  {
    slug: "25-lpa",
    lpaValue: 25,
    ctc: 2500000,
    label: "25 LPA",
    description: "A CTC of 25 LPA (Rs. 25,00,000/year) puts you in a high-earning bracket typical for senior engineers at top tech companies and mid-level managers. Tax liability exceeds Rs. 4 lakh under the new regime, making regime comparison essential.",
    nearbyLpa: ["20-lpa", "30-lpa", "40-lpa", "50-lpa"],
  },
  {
    slug: "30-lpa",
    lpaValue: 30,
    ctc: 3000000,
    label: "30 LPA",
    description: "At 30 LPA (Rs. 30,00,000/year), typical for principal engineers, senior managers, and VP-level roles, income tax becomes a major deduction — over Rs. 5 lakh under new regime. Structuring your salary (higher basic vs allowances) becomes a key optimization lever.",
    nearbyLpa: ["25-lpa", "40-lpa", "50-lpa", "75-lpa"],
  },
  {
    slug: "40-lpa",
    lpaValue: 40,
    ctc: 4000000,
    label: "40 LPA",
    description: "A CTC of 40 LPA (Rs. 40,00,000/year) is in the top bracket for Indian salaries, common in FAANG companies, investment banking, and senior leadership roles. Tax under the new regime exceeds Rs. 8 lakh, and both regime comparison and salary structuring are critical.",
    nearbyLpa: ["30-lpa", "50-lpa", "75-lpa", "1-crore"],
  },
  {
    slug: "50-lpa",
    lpaValue: 50,
    ctc: 5000000,
    label: "50 LPA",
    description: "At 50 LPA (Rs. 50,00,000/year), you're among the top 1% of Indian earners. Tax under the new regime is approximately Rs. 11.5 lakh. This calculator helps you understand the exact monthly in-hand amount after all deductions including PF, professional tax, and income tax.",
    nearbyLpa: ["40-lpa", "75-lpa", "1-crore", "30-lpa"],
  },
  {
    slug: "75-lpa",
    lpaValue: 75,
    ctc: 7500000,
    label: "75 LPA",
    description: "A CTC of 75 LPA (Rs. 75,00,000/year) is premium compensation typical for directors at large MNCs, senior VPs in finance, and distinguished engineers at top tech firms. Tax liability under the new regime exceeds Rs. 18 lakh, making this a high-tax bracket.",
    nearbyLpa: ["50-lpa", "1-crore", "40-lpa", "30-lpa"],
  },
  {
    slug: "1-crore",
    lpaValue: 100,
    ctc: 10000000,
    label: "1 Crore",
    description: "A CTC of 1 Crore (Rs. 1,00,00,000/year) is the benchmark for C-suite executives, startup founders, and top-tier professionals. Tax under the new regime exceeds Rs. 25 lakh. At this level, salary structuring, perquisite management, and ESOP taxation become critical considerations.",
    nearbyLpa: ["75-lpa", "50-lpa", "40-lpa", "30-lpa"],
  },
  {
    slug: "1.5-crore",
    lpaValue: 150,
    ctc: 15000000,
    label: "1.5 Crore",
    description: "At 1.5 Crore (Rs. 1,50,00,000/year), compensation is typically a mix of base salary, bonuses, RSUs, and ESOPs — common for senior leadership at unicorns and multinational firms. Tax exceeds Rs. 40 lakh, making salary structuring and component optimization essential.",
    nearbyLpa: ["1-crore", "75-lpa", "50-lpa", "40-lpa"],
  },
];

export function getLpaBySlug(slug: string): SalaryLPA | undefined {
  return salaryLpaData.find((l) => l.slug === slug);
}
