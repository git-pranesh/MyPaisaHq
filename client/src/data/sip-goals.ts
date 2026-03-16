export interface SIPGoal {
  slug: string;
  name: string;
  emoji: string;
  targetAmount: number;
  timelineYears: number;
  monthlyInvestment: number;
  annualReturn: number;
  stepUpPercent: number;
  nearbyGoals: string[];
  description: string;
}

export const sipGoals: SIPGoal[] = [
  {
    slug: "retirement",
    name: "Retirement Planning",
    emoji: "\u{1F3D6}\u{FE0F}",
    targetAmount: 30000000,
    timelineYears: 30,
    monthlyInvestment: 25000,
    annualReturn: 12,
    stepUpPercent: 10,
    nearbyGoals: ["house-purchase", "child-education", "wedding"],
    description: "Build a corpus to retire comfortably and maintain your lifestyle without active income.",
  },
  {
    slug: "house-purchase",
    name: "House Purchase",
    emoji: "\u{1F3E0}",
    targetAmount: 10000000,
    timelineYears: 7,
    monthlyInvestment: 30000,
    annualReturn: 12,
    stepUpPercent: 10,
    nearbyGoals: ["retirement", "car-purchase", "wedding"],
    description: "Save for the down payment or full purchase price of your dream home.",
  },
  {
    slug: "child-education",
    name: "Child's Education",
    emoji: "\u{1F393}",
    targetAmount: 5000000,
    timelineYears: 15,
    monthlyInvestment: 15000,
    annualReturn: 12,
    stepUpPercent: 10,
    nearbyGoals: ["retirement", "wedding", "house-purchase"],
    description: "Fund your child's higher education at top institutions in India or abroad.",
  },
  {
    slug: "emergency-fund",
    name: "Emergency Fund",
    emoji: "\u{1F6E1}\u{FE0F}",
    targetAmount: 600000,
    timelineYears: 3,
    monthlyInvestment: 15000,
    annualReturn: 7,
    stepUpPercent: 0,
    nearbyGoals: ["car-purchase", "vacation", "house-purchase"],
    description: "Build a safety net covering 6-12 months of expenses for unexpected situations.",
  },
  {
    slug: "car-purchase",
    name: "Car Purchase",
    emoji: "\u{1F697}",
    targetAmount: 1200000,
    timelineYears: 3,
    monthlyInvestment: 20000,
    annualReturn: 8,
    stepUpPercent: 0,
    nearbyGoals: ["emergency-fund", "house-purchase", "vacation"],
    description: "Save to buy your car outright instead of taking a high-interest auto loan.",
  },
  {
    slug: "vacation",
    name: "Dream Vacation",
    emoji: "\u{2708}\u{FE0F}",
    targetAmount: 500000,
    timelineYears: 2,
    monthlyInvestment: 20000,
    annualReturn: 7,
    stepUpPercent: 0,
    nearbyGoals: ["car-purchase", "emergency-fund", "wedding"],
    description: "Plan and fund your dream vacation without dipping into savings or taking debt.",
  },
  {
    slug: "wedding",
    name: "Wedding Fund",
    emoji: "\u{1F48D}",
    targetAmount: 2000000,
    timelineYears: 5,
    monthlyInvestment: 25000,
    annualReturn: 8,
    stepUpPercent: 0,
    nearbyGoals: ["house-purchase", "child-education", "vacation"],
    description: "Build a dedicated fund for your dream wedding without financial stress.",
  },
];

export function getGoalBySlug(slug: string): SIPGoal | undefined {
  return sipGoals.find((g) => g.slug === slug);
}
