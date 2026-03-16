import { useState, useMemo } from "react";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ArrowRight } from "lucide-react";
import ResultCard from "@/components/result-card";
import SEOHead from "@/components/seo-head";
import Breadcrumb from "@/components/breadcrumb";
import FAQSection, { type FAQItem } from "@/components/faq-section";
import { formatINR, formatINRCompact } from "@/lib/formatters";
import { getGoalBySlug, sipGoals } from "@/data/sip-goals";
import NotFound from "@/pages/not-found";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const standardSipFaqs: FAQItem[] = [
  { question: "What is SIP and how does it work?", answer: "SIP (Systematic Investment Plan) is a method of investing a fixed amount regularly in mutual funds. You choose the amount, frequency (usually monthly), and the fund. SIP uses rupee cost averaging — buying more units when prices are low and fewer when high — reducing the impact of market volatility." },
  { question: "Is SIP better than lump sum investment?", answer: "SIP is better for most investors because it averages market volatility (rupee cost averaging), requires a small starting amount, and builds investing discipline. Lump sum is better if you have a large amount and markets are at a low point, but timing the market is difficult." },
  { question: "How much should I invest in SIP monthly?", answer: "A common guideline is the 50-30-20 rule: invest at least 20% of your take-home salary. Start with what you can afford consistently, then increase annually with step-up SIP. Use goal-based calculations to determine exact amounts for each financial goal." },
  { question: "What is step-up SIP?", answer: "Step-up SIP (or Top-up SIP) automatically increases your monthly SIP amount by a fixed percentage every year. For example, a 10% step-up on ₹10,000 SIP means investing ₹11,000 in year 2, ₹12,100 in year 3, and so on. This aligns investments with salary growth and dramatically reduces the starting amount needed." },
  { question: "What returns can I expect from SIP?", answer: "Historical returns vary by fund type: large-cap equity funds average 10-12% CAGR, mid-cap 12-15%, small-cap 14-18%, and debt funds 6-8%. Past performance doesn't guarantee future returns. For long-term goals (10+ years), 12% is a reasonable assumption for equity SIPs." },
];

export default function SIPGoalPage() {
  const { goal } = useParams<{ goal: string }>();
  const goalData = getGoalBySlug(goal || "");

  if (!goalData) {
    return <NotFound />;
  }

  return <SIPGoalCalculator key={goalData.slug} goalData={goalData} />;
}

function SIPGoalCalculator({ goalData }: { goalData: NonNullable<ReturnType<typeof getGoalBySlug>> }) {
  const [monthlyInv, setMonthlyInv] = useState(goalData.monthlyInvestment);
  const [annualReturn, setAnnualReturn] = useState(goalData.annualReturn);
  const [duration, setDuration] = useState(goalData.timelineYears);
  const [stepUpEnabled, setStepUpEnabled] = useState(goalData.stepUpPercent > 0);
  const [stepUpPercent, setStepUpPercent] = useState(goalData.stepUpPercent || 10);

  const safeDuration = Math.max(1, duration);

  const chartData = useMemo(() => {
    const data: { year: number; invested: number; value: number }[] = [];
    const r = annualReturn / 100 / 12;
    let totalInvested = 0;
    let totalValue = 0;

    for (let year = 1; year <= safeDuration; year++) {
      const sipAmount = stepUpEnabled
        ? monthlyInv * Math.pow(1 + stepUpPercent / 100, year - 1)
        : monthlyInv;

      for (let month = 1; month <= 12; month++) {
        totalInvested += sipAmount;
        totalValue = (totalValue + sipAmount) * (1 + r);
      }

      data.push({
        year,
        invested: Math.round(totalInvested),
        value: Math.round(totalValue),
      });
    }
    return data;
  }, [monthlyInv, annualReturn, safeDuration, stepUpEnabled, stepUpPercent]);

  const finalData = chartData[chartData.length - 1] || { invested: 0, value: 0 };
  const totalInvested = finalData.invested;
  const maturityValue = finalData.value;
  const estimatedReturns = maturityValue - totalInvested;
  const targetMet = maturityValue >= goalData.targetAmount;
  const progressPercent = Math.min(100, (maturityValue / goalData.targetAmount) * 100);

  const copyText = `SIP for ${goalData.name}\nTarget: ${formatINR(goalData.targetAmount)}\nMonthly SIP: ${formatINR(monthlyInv)}\nExpected Return: ${annualReturn}%\nDuration: ${safeDuration} years${stepUpEnabled ? `\nStep-up: ${stepUpPercent}%/yr` : ""}\nTotal Invested: ${formatINR(totalInvested)}\nEstimated Returns: ${formatINR(estimatedReturns)}\nMaturity Value: ${formatINR(maturityValue)}`;

  const nearbyGoalData = goalData.nearbyGoals
    .map((slug) => sipGoals.find((g) => g.slug === slug))
    .filter(Boolean);

  const goalFaqs: FAQItem[] = [
    {
      question: `How much SIP do I need for ${goalData.name.toLowerCase()}?`,
      answer: `To reach a ${goalData.name.toLowerCase()} goal of ${formatINRCompact(goalData.targetAmount)} in ${goalData.timelineYears} years, you need approximately ${formatINR(goalData.monthlyInvestment)}/month SIP at ${goalData.annualReturn}% expected annual return${goalData.stepUpPercent > 0 ? ` with ${goalData.stepUpPercent}% annual step-up` : ""}. Adjust the inputs above based on your specific target and timeline.`,
    },
    {
      question: `What return rate should I assume for ${goalData.name.toLowerCase()}?`,
      answer: goalData.annualReturn >= 10
        ? `For ${goalData.name.toLowerCase()} with a ${goalData.timelineYears}-year timeline, a ${goalData.annualReturn}% annual return is reasonable for equity mutual funds based on historical performance. Long-term equity SIPs (10+ years) have historically delivered 10-15% CAGR in India. Consider diversifying across large-cap and flexi-cap funds.`
        : `For ${goalData.name.toLowerCase()} with a short ${goalData.timelineYears}-year timeline, a ${goalData.annualReturn}% return is appropriate. Short-term goals should use conservative instruments like debt funds, liquid funds, or fixed deposits to avoid market volatility risk. Equity is not recommended for goals under 3-5 years.`,
    },
  ];

  const allFaqs = [...goalFaqs, ...standardSipFaqs];

  const shortIntro = useMemo(() => {
    const intros: Record<string, string> = {
      retirement: `To retire comfortably, you need to start investing ₹${goalData.monthlyInvestment.toLocaleString("en-IN")}/month today. With a target corpus of ${formatINRCompact(goalData.targetAmount)} over ${goalData.timelineYears} years, this calculator shows exactly how your investments grow.`,
      "house-purchase": `Saving for a home worth ${formatINRCompact(goalData.targetAmount)} in ${goalData.timelineYears} years? Start with a monthly SIP of ₹${goalData.monthlyInvestment.toLocaleString("en-IN")} and track your progress toward the down payment or full purchase price.`,
      "child-education": `Higher education costs are rising at 10-12% annually. To fund ${formatINRCompact(goalData.targetAmount)} for your child's education in ${goalData.timelineYears} years, start with ₹${goalData.monthlyInvestment.toLocaleString("en-IN")}/month today.`,
      "emergency-fund": `Build a safety net of ${formatINRCompact(goalData.targetAmount)} (6-12 months of expenses) in ${goalData.timelineYears} years. Conservative returns with a SIP of ₹${goalData.monthlyInvestment.toLocaleString("en-IN")}/month.`,
      "car-purchase": `Planning to buy a car worth ${formatINRCompact(goalData.targetAmount)} in ${goalData.timelineYears} years? Instead of an auto loan at 8-10%, save with a monthly SIP of ₹${goalData.monthlyInvestment.toLocaleString("en-IN")} and buy it outright.`,
      vacation: `Fund your dream vacation of ${formatINRCompact(goalData.targetAmount)} in ${goalData.timelineYears} years with a monthly SIP of ₹${goalData.monthlyInvestment.toLocaleString("en-IN")}. No debt, no guilt — just planned savings.`,
      wedding: `Plan your dream wedding of ${formatINRCompact(goalData.targetAmount)} in ${goalData.timelineYears} years. A monthly SIP of ₹${goalData.monthlyInvestment.toLocaleString("en-IN")} builds the fund without financial stress.`,
    };
    return intros[goalData.slug] || `Plan your ${goalData.name.toLowerCase()} with a target of ${formatINRCompact(goalData.targetAmount)} in ${goalData.timelineYears} years.`;
  }, [goalData]);

  const jsonLd = useMemo(() => [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: `SIP Calculator for ${goalData.name} 2025-26`,
      url: `https://mypaisahq.com/sip-calculator/${goalData.slug}`,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      description: `Calculate monthly SIP needed for ${goalData.name.toLowerCase()} — target ${formatINRCompact(goalData.targetAmount)} in ${goalData.timelineYears} years.`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://mypaisahq.com" },
        { "@type": "ListItem", position: 2, name: "SIP Calculator by Goal", item: "https://mypaisahq.com/sip-calculator" },
        { "@type": "ListItem", position: 3, name: `SIP for ${goalData.name}`, item: `https://mypaisahq.com/sip-calculator/${goalData.slug}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: allFaqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ], [goalData, allFaqs]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <SEOHead
        title={`SIP Calculator for ${goalData.name} 2025-26 | Monthly Investment Needed | My Paisa HQ`}
        description={`Calculate monthly SIP needed for ${goalData.name.toLowerCase()} — target ${formatINRCompact(goalData.targetAmount)} in ${goalData.timelineYears} years at ${goalData.annualReturn}% returns. Pre-filled with realistic defaults.`}
        canonicalPath={`/sip-calculator/${goalData.slug}`}
        jsonLd={jsonLd}
      />
      <Breadcrumb
        currentPage={`SIP for ${goalData.name}`}
        parent={{ label: "SIP Calculator by Goal", href: "/sip-calculator" }}
      />
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" data-testid="heading-sip-goal">
          {goalData.emoji} SIP Calculator — {goalData.name}
        </h1>
        <p className="text-muted-foreground">{goalData.description}</p>
      </div>

      <div className="mb-6 p-4 rounded-lg border">
        <p className="text-sm text-muted-foreground leading-relaxed">{shortIntro}</p>
        <a href="#calculator" className="text-sm text-primary hover:underline mt-2 inline-block" data-testid="link-calculate-goal">
          Calculate for My Goal →
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="calculator">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">SIP Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Monthly SIP Amount</Label>
              <Input type="number" min={500} value={monthlyInv} onChange={(e) => setMonthlyInv(Math.max(500, Number(e.target.value)))} data-testid="input-monthly-sip" />
            </div>
            <div className="space-y-2">
              <Label>Expected Annual Return (%)</Label>
              <Input type="number" min={1} max={30} step={0.5} value={annualReturn} onChange={(e) => setAnnualReturn(Math.max(1, Math.min(30, Number(e.target.value))))} data-testid="input-annual-return" />
            </div>
            <div className="space-y-2">
              <Label>Investment Duration (Years)</Label>
              <Input type="number" min={1} max={50} value={duration} onChange={(e) => setDuration(Math.max(1, Math.min(50, Math.floor(Number(e.target.value)))))} data-testid="input-duration" />
            </div>
            <div className="flex items-center justify-between gap-2 p-3 rounded-md bg-muted/50">
              <div>
                <Label>Step-up SIP</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Increase SIP annually</p>
              </div>
              <Switch checked={stepUpEnabled} onCheckedChange={setStepUpEnabled} data-testid="switch-stepup" />
            </div>
            {stepUpEnabled && (
              <div className="space-y-2">
                <Label>Annual Step-up (%)</Label>
                <Input type="number" min={1} max={50} value={stepUpPercent} onChange={(e) => setStepUpPercent(Math.max(1, Math.min(50, Number(e.target.value))))} data-testid="input-stepup-percent" />
              </div>
            )}
            <div className="p-3 rounded-md bg-primary/10 text-xs">
              <p><strong>Goal:</strong> {goalData.name} — {formatINRCompact(goalData.targetAmount)}</p>
            </div>
          </CardContent>
        </Card>

        <ResultCard title={`SIP Projection — ${goalData.name}`} copyText={copyText} id="sip-goal-result">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-md bg-muted/50">
                <p className="text-xs text-muted-foreground">Invested</p>
                <p className="text-sm font-bold mt-1" data-testid="text-total-invested">{formatINRCompact(totalInvested)}</p>
              </div>
              <div className="text-center p-3 rounded-md bg-muted/50">
                <p className="text-xs text-muted-foreground">Returns</p>
                <p className="text-sm font-bold text-green-600 dark:text-green-400 mt-1" data-testid="text-returns">{formatINRCompact(estimatedReturns)}</p>
              </div>
              <div className="text-center p-3 rounded-md bg-primary/10">
                <p className="text-xs text-muted-foreground">Maturity</p>
                <p className="text-sm font-bold text-primary mt-1" data-testid="text-maturity">{formatINRCompact(maturityValue)}</p>
              </div>
            </div>

            <div className="p-3 rounded-md bg-muted/50">
              <div className="flex justify-between text-xs mb-2">
                <span>Goal Progress</span>
                <span>{Math.round(progressPercent)}% of {formatINRCompact(goalData.targetAmount)}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${targetMet ? "bg-green-500" : "bg-primary"}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className={`p-3 rounded-md text-sm font-medium text-center ${targetMet ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"}`} data-testid="text-goal-status">
              {targetMet
                ? `Goal achieved! Maturity exceeds target by ${formatINRCompact(maturityValue - goalData.targetAmount)}`
                : `Shortfall of ${formatINRCompact(goalData.targetAmount - maturityValue)} — increase SIP or duration`}
            </div>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} tickFormatter={(v) => `Y${v}`} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatINRCompact(v)} width={60} />
                  <Tooltip
                    formatter={(value: number, name: string) => [formatINR(value), name === "invested" ? "Invested" : "Value"]}
                    labelFormatter={(label) => `Year ${label}`}
                    contentStyle={{ borderRadius: "6px", fontSize: "12px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--background))" }}
                  />
                  <Area type="monotone" dataKey="invested" stackId="1" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="value" stackId="2" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
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
                <span>Total Value</span>
              </div>
            </div>
          </div>
        </ResultCard>
      </div>

      <FAQSection faqs={allFaqs} />

      {nearbyGoalData.length > 0 && (
        <div className="mt-8">
          <h2 className="text-base font-semibold mb-3">Explore Other Goals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {nearbyGoalData.map((g) => g && (
              <Link key={g.slug} href={`/sip-calculator/${g.slug}`}>
                <Card className="h-full hover:border-primary/50 cursor-pointer transition-colors" data-testid={`link-nearby-${g.slug}`}>
                  <CardContent className="pt-4 pb-3 px-4">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium">{g.emoji} {g.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{formatINRCompact(g.targetAmount)} | {g.timelineYears}yr</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 text-center">
        <Link href="/sip" className="text-sm text-primary hover:underline" data-testid="link-sip-generic">
          Use the general SIP returns calculator →
        </Link>
      </div>
    </div>
  );
}
