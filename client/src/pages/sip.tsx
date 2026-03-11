import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import ResultCard from "@/components/result-card";
import SEOHead from "@/components/seo-head";
import Breadcrumb from "@/components/breadcrumb";
import FAQSection, { type FAQItem } from "@/components/faq-section";
import RelatedTools from "@/components/related-tools";
import { formatINR, formatINRCompact } from "@/lib/formatters";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const faqs: FAQItem[] = [
  {
    question: "How does SIP (Systematic Investment Plan) work?",
    answer: "SIP is a method of investing a fixed amount regularly (usually monthly) in mutual funds. Each month, your SIP amount buys units at the current NAV (Net Asset Value). Over time, this averages out the cost of buying units — a concept called rupee cost averaging. SIPs benefit from compounding, where returns earned are reinvested to generate further returns.",
  },
  {
    question: "What is step-up SIP and how does it help?",
    answer: "Step-up SIP (also called top-up SIP) means increasing your SIP amount by a fixed percentage every year. For example, a 10% step-up on a Rs. 10,000 SIP means investing Rs. 11,000 in year 2, Rs. 12,100 in year 3, and so on. This aligns your investments with salary growth and significantly boosts your final corpus. A 10% annual step-up over 15 years can result in 50-80% more corpus compared to a flat SIP.",
  },
  {
    question: "What returns can I expect from SIP in India?",
    answer: "Historical returns from equity mutual funds in India have averaged 12-15% annually over 10+ year periods. Large-cap funds typically deliver 10-12%, mid-cap funds 12-15%, and small-cap funds 14-18% over long periods. However, past performance doesn't guarantee future returns. For conservative planning, use 10-12% for equity and 6-8% for debt fund SIPs.",
  },
  {
    question: "How much should I invest in SIP per month?",
    answer: "A common guideline is to invest at least 20-30% of your monthly income through SIPs. You can start with as little as Rs. 500/month. The right amount depends on your financial goals, time horizon, and risk tolerance. Use a goal-based calculator to determine the exact SIP amount needed for your specific goals like retirement, child education, or house purchase.",
  },
  {
    question: "Is SIP better than lump sum investment?",
    answer: "SIP is generally better for most investors because: (1) it averages purchase costs through rupee cost averaging, reducing the impact of market volatility, (2) it enforces investment discipline, (3) it's easier on your monthly budget. Lump sum can outperform SIP in consistently rising markets, but SIP provides better risk-adjusted returns for most investors over the long term.",
  },
];

const relatedTools = [
  { href: "/goal-sip", title: "Goal-based Top-up SIP", desc: "Calculate SIP needed for a specific financial goal" },
  { href: "/loan-vs-sip", title: "Loan vs SIP", desc: "Should you prepay your loan or invest in SIP?" },
  { href: "/hike", title: "Salary Hike Calculator", desc: "Invest your increment — see how it grows" },
];

export default function SIP() {
  const [monthlyInv, setMonthlyInv] = useState(10000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [duration, setDuration] = useState(10);
  const [stepUpEnabled, setStepUpEnabled] = useState(false);
  const [stepUpPercent, setStepUpPercent] = useState(10);

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

  const copyText = `SIP Returns\nMonthly Investment: ${formatINR(monthlyInv)}\nExpected Return: ${annualReturn}%\nDuration: ${safeDuration} years${stepUpEnabled ? `\nStep-up: ${stepUpPercent}%/yr` : ""}\nTotal Invested: ${formatINR(totalInvested)}\nEstimated Returns: ${formatINR(estimatedReturns)}\nMaturity Value: ${formatINR(maturityValue)}`;

  const jsonLd = useMemo(() => [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "SIP Returns Calculator",
      url: "https://mypaisahq.com/sip",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      description: "Calculate SIP returns with optional step-up (top-up) feature. Visualize investment growth over time with area chart.",
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
        { "@type": "ListItem", position: 2, name: "SIP Returns Calculator", item: "https://mypaisahq.com/sip" },
      ],
    },
  ], []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <SEOHead
        title="SIP Returns Calculator with Step-up - My Paisa HQ"
        description="Calculate SIP (Systematic Investment Plan) returns with optional annual step-up. Estimate maturity value, total invested amount and wealth gained over time with interactive growth chart."
        canonicalPath="/sip"
        jsonLd={jsonLd}
      />
      <Breadcrumb currentPage="SIP Returns Calculator" />
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">SIP Returns Calculator</h1>
        <p className="text-muted-foreground">Estimate returns from your systematic investment plan with step-up option</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Investment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Monthly Investment</Label>
              <Input
                type="number"
                min={0}
                value={monthlyInv}
                onChange={(e) => setMonthlyInv(Math.max(0, Number(e.target.value)))}
                data-testid="input-monthly-inv"
              />
            </div>
            <div className="space-y-2">
              <Label>Expected Annual Return (%)</Label>
              <Input
                type="number"
                min={0}
                max={50}
                value={annualReturn}
                onChange={(e) => setAnnualReturn(Math.max(0, Number(e.target.value)))}
                data-testid="input-annual-return"
              />
            </div>
            <div className="space-y-2">
              <Label>Investment Duration (Years)</Label>
              <Input
                type="number"
                min={1}
                max={40}
                value={duration}
                onChange={(e) => setDuration(Math.max(1, Math.min(40, Math.floor(Number(e.target.value)))))}
                data-testid="input-duration"
              />
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
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={stepUpPercent}
                  onChange={(e) => setStepUpPercent(Math.max(0, Number(e.target.value)))}
                  data-testid="input-stepup-percent"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <ResultCard title="SIP Returns" copyText={copyText} id="sip">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-md bg-muted/50">
                <p className="text-xs text-muted-foreground">Invested</p>
                <p className="text-sm font-bold mt-1" data-testid="text-total-invested">
                  {formatINRCompact(totalInvested)}
                </p>
              </div>
              <div className="text-center p-3 rounded-md bg-muted/50">
                <p className="text-xs text-muted-foreground">Returns</p>
                <p className="text-sm font-bold text-green-600 dark:text-green-400 mt-1" data-testid="text-returns">
                  {formatINRCompact(estimatedReturns)}
                </p>
              </div>
              <div className="text-center p-3 rounded-md bg-primary/10">
                <p className="text-xs text-muted-foreground">Maturity</p>
                <p className="text-sm font-bold text-primary mt-1" data-testid="text-maturity">
                  {formatINRCompact(maturityValue)}
                </p>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `Y${v}`}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => formatINRCompact(v)}
                    width={60}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      formatINR(value),
                      name === "invested" ? "Invested" : "Value",
                    ]}
                    labelFormatter={(label) => `Year ${label}`}
                    contentStyle={{
                      borderRadius: "6px",
                      fontSize: "12px",
                      border: "1px solid hsl(var(--border))",
                      backgroundColor: "hsl(var(--background))",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="invested"
                    stackId="1"
                    stroke="hsl(var(--chart-2))"
                    fill="hsl(var(--chart-2))"
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stackId="2"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.2}
                  />
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

      <RelatedTools tools={relatedTools} />
      <FAQSection faqs={faqs} />
    </div>
  );
}
