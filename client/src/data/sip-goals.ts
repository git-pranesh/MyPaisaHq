export interface SIPGoal {
  slug: string;
  name: string;
  targetAmount: number;
  duration: number;
  expectedReturn: number;
  stepUpPercent: number;
  description: string;
  nearbyGoals: string[];
}

export const sipGoals: SIPGoal[] = [
  {
    slug: "1-crore",
    name: "1 Crore Corpus",
    targetAmount: 10000000,
    duration: 15,
    expectedReturn: 12,
    stepUpPercent: 10,
    description: "Building a 1 crore corpus through SIP is a realistic goal for most Indian professionals. With a disciplined monthly SIP at 12% expected returns over 15 years, you can achieve this milestone. Step-up SIP (increasing investment annually) significantly reduces the starting amount needed.",
    nearbyGoals: ["retirement", "child-education", "house-down-payment"],
  },
  {
    slug: "retirement",
    name: "Retirement Planning",
    targetAmount: 50000000,
    duration: 25,
    expectedReturn: 12,
    stepUpPercent: 10,
    description: "Planning for retirement requires building a corpus that generates enough passive income to maintain your lifestyle. For a comfortable retirement in India, a corpus of Rs. 5 crore (adjusted for inflation) over 25 years is a strong target. Starting early and using step-up SIP makes this achievable even with modest starting amounts.",
    nearbyGoals: ["1-crore", "financial-freedom", "child-education"],
  },
  {
    slug: "child-education",
    name: "Child's Higher Education",
    targetAmount: 25000000,
    duration: 15,
    expectedReturn: 12,
    stepUpPercent: 10,
    description: "Higher education costs in India and abroad are rising at 8-10% annually. An IIM MBA costs Rs. 25-30 lakh today, while studying abroad can exceed Rs. 50 lakh. Planning a SIP for your child's education 15 years in advance, with annual step-ups, ensures you're prepared without taking education loans.",
    nearbyGoals: ["1-crore", "house-down-payment", "retirement"],
  },
  {
    slug: "house-down-payment",
    name: "House Down Payment",
    targetAmount: 3000000,
    duration: 5,
    expectedReturn: 10,
    stepUpPercent: 10,
    description: "Saving for a house down payment (typically 20% of property value) through SIP is a smart strategy. For a Rs. 1.5 crore property, you need Rs. 30 lakh as down payment. A 5-year SIP in balanced funds (10% expected return) with annual step-up can help you build this corpus without touching your emergency fund.",
    nearbyGoals: ["1-crore", "emergency-fund", "child-education"],
  },
  {
    slug: "emergency-fund",
    name: "Emergency Fund",
    targetAmount: 600000,
    duration: 3,
    expectedReturn: 7,
    stepUpPercent: 10,
    description: "An emergency fund covering 6-12 months of expenses is the foundation of financial planning. For a family spending Rs. 50,000/month, you need Rs. 3-6 lakh as emergency fund. Use liquid or ultra-short-term debt fund SIPs (7% expected return) to build this safely over 2-3 years.",
    nearbyGoals: ["house-down-payment", "1-crore", "financial-freedom"],
  },
  {
    slug: "financial-freedom",
    name: "Financial Freedom (5 Crore)",
    targetAmount: 50000000,
    duration: 20,
    expectedReturn: 12,
    stepUpPercent: 10,
    description: "Financial freedom — having enough passive income to cover all expenses — typically requires 25-30x your annual expenses as corpus. For annual expenses of Rs. 15-20 lakh, a corpus of Rs. 5 crore (at 4% withdrawal rate) provides financial independence. A 20-year disciplined SIP journey can get you there.",
    nearbyGoals: ["retirement", "1-crore", "child-education"],
  },
  {
    slug: "car-purchase",
    name: "Car Purchase Fund",
    targetAmount: 1500000,
    duration: 3,
    expectedReturn: 8,
    stepUpPercent: 10,
    description: "Instead of taking a car loan at 8-10% interest, building a car fund through SIP for 3 years is financially smarter. For a Rs. 15 lakh car, a monthly SIP in conservative hybrid funds (8% expected return) helps you buy the car outright, saving Rs. 2-3 lakh in loan interest.",
    nearbyGoals: ["emergency-fund", "house-down-payment", "1-crore"],
  },
];

export function getGoalBySlug(slug: string): SIPGoal | undefined {
  return sipGoals.find((g) => g.slug === slug);
}
