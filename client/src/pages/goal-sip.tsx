import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ResultCard from "@/components/result-card";
import SEOHead from "@/components/seo-head";
import Breadcrumb from "@/components/breadcrumb";
import FAQSection, { type FAQItem } from "@/components/faq-section";
import RelatedTools from "@/components/related-tools";
import { formatINR, formatINRCompact } from "@/lib/formatters";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const faqs: FAQItem[] = [
  {
    question: "What is a goal-based SIP?",
    answer: "A goal-based SIP is an investment approach where you calculate the monthly SIP amount needed to reach a specific financial goal (like buying a house, child's education, or retirement) within a set time frame. It reverse-calculates the required monthly investment based on your target amount, investment horizon, expected returns, and inflation rate.",
  },
  {
    question: "How does SIP top-up (step-up) work?",
    answer: "SIP top-up means increasing your monthly SIP amount by a fixed percentage every year. For example, with a 10% annual top-up, if you start with Rs. 10,000/month, you invest Rs. 11,000/month in year 2, Rs. 12,100/month in year 3, and so on. This strategy helps you invest more as your income grows, significantly reducing the starting SIP amount needed to reach your goal.",
  },
  {
    question: "How does inflation affect my financial goal?",
    answer: "Inflation increases the cost of your goal over time. For example, if your goal is Rs. 1 crore today and inflation is 6%, the same goal will cost approximately Rs. 2.40 crore in 15 years. This calculator automatically adjusts your target for inflation, so the SIP amount it calculates will help you reach the inflation-adjusted (future) value of your goal, not just the present value.",
  },
  {
    question: "What return rate should I assume for goal-based SIP?",
    answer: "For equity mutual fund SIPs, assume 10-12% annual returns for long-term goals (10+ years). For medium-term goals (5-10 years), use 8-10% with a balanced fund approach. For short-term goals (under 5 years), use 6-7% with debt funds. Always be conservative in your assumptions — it's better to overshoot your goal than fall short.",
  },
  {
    question: "How much SIP do I need for 1 crore in 15 years?",
    answer: "At 12% annual returns with no step-up, you would need approximately Rs. 20,000/month SIP for 15 years to accumulate Rs. 1 crore. With a 10% annual step-up, you can start with just Rs. 10,500/month. If you account for 6% inflation (making your real target about Rs. 2.40 crore), you would need approximately Rs. 48,000/month without step-up or Rs. 25,000/month with 10% step-up.",
  },
];

const relatedTools = [
  { href: "/sip", title: "SIP Returns Calculator", desc: "Estimate returns from a fixed monthly SIP" },
  { href: "/loan-vs-sip", title: "Loan vs SIP", desc: "Should you prepay your loan or invest in SIP?" },
  { href: "/income-tax", title: "Income Tax Calculator", desc: "Plan taxes alongside your investment goals" },
];

export default function GoalSIP() {
  const [goalAmount, setGoalAmount] = useState(10000000);
  const [investmentYears, setInvestmentYears] = useState(15);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [inflationRate, setInflationRate] = useState(6);
  const [topUpPercent, setTopUpPercent] = useState(10);

  const safeYears = Math.max(1, investmentYears);

  const inflationAdjustedGoal = Math.round(goalAmount * Math.pow(1 + inflationRate / 100, safeYears));

  const monthlySIP = useMemo(() => {
    const r = expectedReturn / 100 / 12;
    const totalMonths = safeYears * 12;

    if (topUpPercent === 0) {
      if (r === 0) return inflationAdjustedGoal / totalMonths;
      const factor = (((Math.pow(1 + r, totalMonths) - 1) / r) * (1 + r));
      return factor > 0 ? inflationAdjustedGoal / factor : 0;
    }

    let totalFV = 0;
    for (let year = 0; year < safeYears; year++) {
      const yearSIP = Math.pow(1 + topUpPercent / 100, year);
      const startMonth = year * 12;

      for (let m = 0; m < 12; m++) {
        const monthsToEnd = totalMonths - startMonth - m;
        if (r > 0) {
          totalFV += yearSIP * Math.pow(1 + r, monthsToEnd);
        } else {
          totalFV += yearSIP;
        }
      }
    }

    return totalFV > 0 ? inflationAdjustedGoal / totalFV : 0;
  }, [inflationAdjustedGoal, expectedReturn, safeYears, topUpPercent]);

  const yearlyData = useMemo(() => {
    const data: { year: number; sipMonthly: number; invested: number; corpus: number }[] = [];
    const r = expectedReturn / 100 / 12;
    let cumulativeInvested = 0;
    let corpus = 0;

    for (let year = 1; year <= safeYears; year++) {
      const currentSIP = monthlySIP * Math.pow(1 + topUpPercent / 100, year - 1);

      for (let m = 0; m < 12; m++) {
        cumulativeInvested += currentSIP;
        corpus = (corpus + currentSIP) * (1 + r);
      }

      data.push({
        year,
        sipMonthly: Math.round(currentSIP),
        invested: Math.round(cumulativeInvested),
        corpus: Math.round(corpus),
      });
    }
    return data;
  }, [monthlySIP, expectedReturn, safeYears, topUpPercent]);

  const finalData = yearlyData[yearlyData.length - 1] || { invested: 0, corpus: 0 };
  const totalInvested = finalData.invested;
  const totalCorpus = finalData.corpus;
  const totalGrowth = totalCorpus - totalInvested;

  const copyText = `Goal-based Top-up SIP\nFinancial Goal: ${formatINR(goalAmount)}\nInflation-adjusted Goal: ${formatINR(inflationAdjustedGoal)}\nInvestment Period: ${safeYears} years\nExpected Return: ${expectedReturn}%\nInflation: ${inflationRate}%\nAnnual Top-up: ${topUpPercent}%\nStarting Monthly SIP: ${formatINR(Math.round(monthlySIP))}\nTotal Invested: ${formatINR(totalInvested)}\nTotal Growth: ${formatINR(totalGrowth)}\nFinal Corpus: ${formatINR(totalCorpus)}`;

  const jsonLd = useMemo(() => [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Goal-based Top-up SIP Calculator",
      url: "https://mypaisahq.com/goal-sip",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      description: "Calculate the monthly SIP needed to reach your financial goal with inflation adjustment and annual top-up. Year-by-year investment summary with growth chart.",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://mypaisahq.com" },
        { "@type": "ListItem", position: 2, name: "Goal-based Top-up SIP Calculator", item: "https://mypaisahq.com/goal-sip" },
      ],
    },
  ], []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <SEOHead
        title="Goal-based Top-up SIP Calculator - My Paisa HQ"
        description="Calculate the monthly SIP needed to reach your financial goal with inflation adjustment and annual step-up. See year-by-year investment summary, corpus growth chart, and inflation-adjusted target amount."
        canonicalPath="/goal-sip"
        jsonLd={jsonLd}
      />
      <Breadcrumb currentPage="Goal-based Top-up SIP Calculator" />
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Goal-based Top-up SIP Calculator</h1>
        <p className="text-muted-foreground">Find how much monthly SIP you need to reach your financial goal, with annual top-ups and inflation adjustment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Goal Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Your Financial Goal</Label>
              <Input
                type="number"
                min={0}
                value={goalAmount}
                onChange={(e) => setGoalAmount(Math.max(0, Number(e.target.value)))}
                data-testid="input-goal-amount"
              />
            </div>
            <div className="space-y-2">
              <Label>Investment Period (Years)</Label>
              <Input
                type="number"
                min={1}
                max={50}
                value={investmentYears}
                onChange={(e) => setInvestmentYears(Math.max(1, Math.min(50, Math.floor(Number(e.target.value)))))}
                data-testid="input-goal-years"
              />
            </div>
            <div className="space-y-2">
              <Label>Expected Rate of Return (% p.a.)</Label>
              <Input
                type="number"
                min={0}
                max={30}
                step={0.5}
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Math.max(0, Number(e.target.value)))}
                data-testid="input-goal-return"
              />
            </div>
            <div className="space-y-2">
              <Label>Expected Inflation Rate (% p.a.)</Label>
              <Input
                type="number"
                min={0}
                max={20}
                step={0.5}
                value={inflationRate}
                onChange={(e) => setInflationRate(Math.max(0, Number(e.target.value)))}
                data-testid="input-goal-inflation"
              />
            </div>
            <div className="space-y-2">
              <Label>Annual SIP Top-up (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={topUpPercent}
                onChange={(e) => setTopUpPercent(Math.max(0, Number(e.target.value)))}
                data-testid="input-goal-topup"
              />
              <p className="text-xs text-muted-foreground">Increase your SIP by this % every year</p>
            </div>
          </CardContent>
        </Card>

        <ResultCard title="Goal SIP Results" copyText={copyText} id="goal-sip">
          <div className="space-y-4">
            <div className="p-4 rounded-md bg-primary/10 text-center">
              <p className="text-sm text-muted-foreground mb-1">Starting Monthly SIP</p>
              <p className="text-3xl font-bold text-primary" data-testid="text-goal-sip-monthly">
                {formatINR(Math.round(monthlySIP))}
              </p>
              <p className="text-xs text-muted-foreground mt-1">for the first year</p>
            </div>

            <div className="p-3 rounded-md bg-muted/50 text-center">
              <p className="text-xs text-muted-foreground mb-1">Inflation-adjusted Goal ({safeYears} years at {inflationRate}%)</p>
              <p className="text-lg font-bold" data-testid="text-inflation-adjusted-goal">
                {formatINR(inflationAdjustedGoal)}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm py-1.5 border-b">
                <span>Total Amount Invested</span>
                <span className="font-medium" data-testid="text-goal-invested">{formatINR(totalInvested)}</span>
              </div>
              <div className="flex justify-between text-sm py-1.5 border-b">
                <span>Total Growth</span>
                <span className="font-medium text-green-600 dark:text-green-400" data-testid="text-goal-growth">{formatINR(totalGrowth)}</span>
              </div>
              <div className="flex justify-between text-sm py-1.5 font-semibold">
                <span>Final Corpus</span>
                <span className="text-primary" data-testid="text-goal-corpus">{formatINR(totalCorpus)}</span>
              </div>
            </div>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yearlyData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} tickFormatter={(v) => `Y${v}`} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatINRCompact(v)} width={60} />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      formatINR(value),
                      name === "invested" ? "Invested" : "Corpus",
                    ]}
                    labelFormatter={(label) => `Year ${label}`}
                    contentStyle={{
                      borderRadius: "6px",
                      fontSize: "12px",
                      border: "1px solid hsl(var(--border))",
                      backgroundColor: "hsl(var(--background))",
                    }}
                  />
                  <Area type="monotone" dataKey="invested" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="corpus" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center gap-4 justify-center text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "hsl(var(--chart-2))" }} />
                <span>Invested</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "hsl(var(--primary))" }} />
                <span>Corpus</span>
              </div>
            </div>
          </div>
        </ResultCard>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Year-by-Year Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Year</th>
                    <th className="text-right py-2 font-medium">Monthly SIP</th>
                    <th className="text-right py-2 font-medium">Total Invested</th>
                    <th className="text-right py-2 font-medium">Corpus Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {yearlyData.map((row) => (
                    <tr key={row.year}>
                      <td className="py-2">{row.year}</td>
                      <td className="text-right py-2">{formatINR(row.sipMonthly)}</td>
                      <td className="text-right py-2">{formatINR(row.invested)}</td>
                      <td className="text-right py-2 text-primary font-medium">{formatINR(row.corpus)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <RelatedTools tools={relatedTools} />
      <FAQSection faqs={faqs} />
    </div>
  );
}
