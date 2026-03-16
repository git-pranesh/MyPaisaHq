import { useState, useMemo } from "react";
import { useParams, Link, Redirect } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ArrowRight } from "lucide-react";
import ResultCard from "@/components/result-card";
import SEOHead from "@/components/seo-head";
import Breadcrumb from "@/components/breadcrumb";
import { formatINR, formatINRCompact } from "@/lib/formatters";
import { getGoalBySlug, sipGoals } from "@/data/sip-goals";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function SIPGoalPage() {
  const { goal } = useParams<{ goal: string }>();
  const goalData = getGoalBySlug(goal || "");

  if (!goalData) {
    return <Redirect to="/sip-calculator" />;
  }

  return <SIPGoalCalculator key={goalData.slug} goalData={goalData} />;
}

function SIPGoalCalculator({ goalData }: { goalData: NonNullable<ReturnType<typeof getGoalBySlug>> }) {
  const [monthlyInv, setMonthlyInv] = useState(() => {
    const r = goalData.expectedReturn / 100 / 12;
    const n = goalData.duration * 12;
    const fv = goalData.targetAmount;
    return Math.round(fv * r / (Math.pow(1 + r, n) - 1));
  });
  const [annualReturn, setAnnualReturn] = useState(goalData.expectedReturn);
  const [duration, setDuration] = useState(goalData.duration);
  const [stepUpEnabled, setStepUpEnabled] = useState(true);
  const [stepUpPercent, setStepUpPercent] = useState(goalData.stepUpPercent);

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

  const copyText = `SIP for ${goalData.name}\nTarget: ${formatINR(goalData.targetAmount)}\nMonthly SIP: ${formatINR(monthlyInv)}\nExpected Return: ${annualReturn}%\nDuration: ${safeDuration} years${stepUpEnabled ? `\nStep-up: ${stepUpPercent}%/yr` : ""}\nTotal Invested: ${formatINR(totalInvested)}\nEstimated Returns: ${formatINR(estimatedReturns)}\nMaturity Value: ${formatINR(maturityValue)}`;

  const nearbyGoalData = goalData.nearbyGoals
    .map((slug) => sipGoals.find((g) => g.slug === slug))
    .filter(Boolean);

  const jsonLd = useMemo(() => [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: `SIP Calculator for ${goalData.name}`,
      url: `https://mypaisahq.com/sip-calculator/${goalData.slug}`,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      description: `Calculate the monthly SIP needed for ${goalData.name}. Target: ₹${goalData.targetAmount.toLocaleString("en-IN")} over ${goalData.duration} years.`,
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
      mainEntity: [
        {
          "@type": "Question",
          name: `How much SIP is needed for ${goalData.name}?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `To build a corpus of ₹${goalData.targetAmount.toLocaleString("en-IN")} for ${goalData.name} over ${goalData.duration} years at ${goalData.expectedReturn}% returns, you need approximately ₹${monthlyInv.toLocaleString("en-IN")}/month SIP${stepUpEnabled ? ` with ${stepUpPercent}% annual step-up` : ""}.`,
          },
        },
      ],
    },
  ], [goalData, monthlyInv, stepUpEnabled, stepUpPercent]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <SEOHead
        title={`SIP Calculator for ${goalData.name} — How Much SIP Do You Need? | My Paisa HQ`}
        description={`Calculate the monthly SIP needed for ${goalData.name}. Target ₹${goalData.targetAmount.toLocaleString("en-IN")} over ${goalData.duration} years at ${goalData.expectedReturn}% returns with step-up SIP option.`}
        canonicalPath={`/sip-calculator/${goalData.slug}`}
        jsonLd={jsonLd}
      />
      <Breadcrumb
        currentPage={`SIP for ${goalData.name}`}
        parent={{ label: "SIP Calculator by Goal", href: "/sip-calculator" }}
      />
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">SIP for {goalData.name}</h1>
        <p className="text-muted-foreground">
          Target: {formatINRCompact(goalData.targetAmount)} over {goalData.duration} years at {goalData.expectedReturn}% expected returns
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Investment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Monthly SIP Amount</Label>
              <Input type="number" min={0} value={monthlyInv} onChange={(e) => setMonthlyInv(Math.max(0, Number(e.target.value)))} data-testid="input-monthly-inv" />
            </div>
            <div className="space-y-2">
              <Label>Expected Annual Return (%)</Label>
              <Input type="number" min={0} max={50} value={annualReturn} onChange={(e) => setAnnualReturn(Math.max(0, Number(e.target.value)))} data-testid="input-annual-return" />
            </div>
            <div className="space-y-2">
              <Label>Investment Duration (Years)</Label>
              <Input type="number" min={1} max={40} value={duration} onChange={(e) => setDuration(Math.max(1, Math.min(40, Math.floor(Number(e.target.value)))))} data-testid="input-duration" />
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
                <Input type="number" min={0} max={100} value={stepUpPercent} onChange={(e) => setStepUpPercent(Math.max(0, Number(e.target.value)))} data-testid="input-stepup-percent" />
              </div>
            )}
            <div className="p-3 rounded-md bg-primary/10 text-xs">
              <p><strong>Goal:</strong> {goalData.name} — {formatINRCompact(goalData.targetAmount)}</p>
            </div>
          </CardContent>
        </Card>

        <ResultCard title={`SIP for ${goalData.name}`} copyText={copyText} id="sip-goal">
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

      <div className="mt-8 p-4 rounded-lg border">
        <h2 className="text-base font-semibold mb-2">About {goalData.name}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{goalData.description}</p>
      </div>

      {nearbyGoalData.length > 0 && (
        <div className="mt-8">
          <h2 className="text-base font-semibold mb-3">Other Financial Goals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {nearbyGoalData.map((g) => g && (
              <Link key={g.slug} href={`/sip-calculator/${g.slug}`}>
                <Card className="h-full hover:border-primary/50 cursor-pointer transition-colors" data-testid={`link-nearby-${g.slug}`}>
                  <CardContent className="pt-4 pb-3 px-4">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium">{g.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{formatINRCompact(g.targetAmount)} | {g.duration}yr</p>
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
