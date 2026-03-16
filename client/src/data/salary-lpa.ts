export interface SalaryLPA {
  lpa: number;
  slug: string;
  annualCTC: number;
  label: string;
  nearbyLpa: number[];
}

export const salaryLpaData: SalaryLPA[] = [
  { lpa: 3, slug: "3-lpa", annualCTC: 300000, label: "3 LPA", nearbyLpa: [4, 5, 6, 7] },
  { lpa: 4, slug: "4-lpa", annualCTC: 400000, label: "4 LPA", nearbyLpa: [3, 5, 6, 7] },
  { lpa: 5, slug: "5-lpa", annualCTC: 500000, label: "5 LPA", nearbyLpa: [4, 6, 7, 8] },
  { lpa: 6, slug: "6-lpa", annualCTC: 600000, label: "6 LPA", nearbyLpa: [5, 7, 8, 9] },
  { lpa: 7, slug: "7-lpa", annualCTC: 700000, label: "7 LPA", nearbyLpa: [6, 8, 9, 10] },
  { lpa: 8, slug: "8-lpa", annualCTC: 800000, label: "8 LPA", nearbyLpa: [7, 9, 10, 12] },
  { lpa: 9, slug: "9-lpa", annualCTC: 900000, label: "9 LPA", nearbyLpa: [8, 10, 12, 15] },
  { lpa: 10, slug: "10-lpa", annualCTC: 1000000, label: "10 LPA", nearbyLpa: [8, 9, 12, 15] },
  { lpa: 12, slug: "12-lpa", annualCTC: 1200000, label: "12 LPA", nearbyLpa: [10, 15, 18, 20] },
  { lpa: 15, slug: "15-lpa", annualCTC: 1500000, label: "15 LPA", nearbyLpa: [12, 18, 20, 25] },
  { lpa: 18, slug: "18-lpa", annualCTC: 1800000, label: "18 LPA", nearbyLpa: [15, 20, 25, 30] },
  { lpa: 20, slug: "20-lpa", annualCTC: 2000000, label: "20 LPA", nearbyLpa: [18, 25, 30, 40] },
  { lpa: 25, slug: "25-lpa", annualCTC: 2500000, label: "25 LPA", nearbyLpa: [20, 30, 40, 50] },
  { lpa: 30, slug: "30-lpa", annualCTC: 3000000, label: "30 LPA", nearbyLpa: [25, 40, 50, 20] },
  { lpa: 40, slug: "40-lpa", annualCTC: 4000000, label: "40 LPA", nearbyLpa: [30, 50, 25, 20] },
  { lpa: 50, slug: "50-lpa", annualCTC: 5000000, label: "50 LPA", nearbyLpa: [40, 30, 25, 20] },
];

export function getLpaBySlug(slug: string): SalaryLPA | undefined {
  return salaryLpaData.find((l) => l.slug === slug);
}
