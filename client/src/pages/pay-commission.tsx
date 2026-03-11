import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import ResultCard from "@/components/result-card";
import SEOHead from "@/components/seo-head";
import Breadcrumb from "@/components/breadcrumb";
import FAQSection, { type FAQItem } from "@/components/faq-section";
import RelatedTools from "@/components/related-tools";
import { formatINR } from "@/lib/formatters";
import { payLevels, getPayValuesForLevel } from "@/lib/pay-matrix";

const faqs: FAQItem[] = [
  {
    question: "What is the 8th Pay Commission fitment factor?",
    answer: "The fitment factor is the multiplier applied to the current basic pay to determine the revised basic pay under a new pay commission. For the 8th CPC, it is expected to be around 2.28x to 2.86x based on historical trends. The 7th CPC used a fitment factor of 2.57x. The final factor will be decided by the commission after its formation.",
  },
  {
    question: "When will the 8th Pay Commission be implemented?",
    answer: "The 8th Pay Commission was approved by the Union Cabinet on January 16, 2025 and is expected to be implemented from January 1, 2026. The commission will submit its recommendations before that date, and the government will then decide on the implementation timeline.",
  },
  {
    question: "Who will benefit from the 8th Pay Commission?",
    answer: "The 8th Pay Commission will benefit approximately 50 lakh central government employees and 65 lakh pensioners. It covers all central government employees across all pay levels (Level 1 to Level 18) under the 7th CPC pay matrix.",
  },
  {
    question: "How is DA (Dearness Allowance) affected by a new pay commission?",
    answer: "When a new pay commission is implemented, the existing DA is merged into the revised basic pay. This means DA resets to 0% at the time of implementation and then starts accumulating again based on the All India Consumer Price Index (AICPI). Currently, DA under the 7th CPC is around 50%.",
  },
  {
    question: "How does HRA change with the 8th Pay Commission?",
    answer: "HRA is calculated as a percentage of the new basic pay: 27% for X cities (metros like Delhi, Mumbai), 18% for Y cities, and 9% for Z cities. Since the basic pay increases significantly, the HRA amount also increases proportionally under the 8th CPC.",
  },
];

const relatedTools = [
  { href: "/salary", title: "In-Hand Salary / CTC", desc: "Break down your CTC into monthly in-hand salary" },
  { href: "/income-tax", title: "Income Tax Calculator", desc: "Compare old vs new tax regime for FY 2025-26" },
  { href: "/gratuity", title: "Gratuity Calculator", desc: "Calculate gratuity based on your service period" },
];

export default function PayCommission() {
  const [selectedLevel, setSelectedLevel] = useState("7");
  const [selectedPay, setSelectedPay] = useState("44900");
  const [fitment, setFitment] = useState(2.28);
  const [cityType, setCityType] = useState<"X" | "Y" | "Z">("X");

  const payValues = useMemo(() => getPayValuesForLevel(selectedLevel), [selectedLevel]);

  const currentBasic = Number(selectedPay);
  const hraRates = { X: 0.27, Y: 0.18, Z: 0.09 };
  const taRates = { X: 7200, Y: 3600, Z: 3600 };

  const oldDA = Math.round(currentBasic * 0.50);
  const oldHRA = Math.round(currentBasic * hraRates[cityType]);
  const oldTA = taRates[cityType];
  const oldGross = currentBasic + oldDA + oldHRA + oldTA;

  const newBasic = Math.round(currentBasic * fitment);
  const newDA = 0;
  const newHRA = Math.round(newBasic * hraRates[cityType]);
  const newTA = taRates[cityType];
  const newGross = newBasic + newDA + newHRA + newTA;
  const increase = newGross - oldGross;
  const increasePercent = oldGross > 0 ? ((increase / oldGross) * 100).toFixed(1) : "0";

  const copyText = `8th Pay Commission Estimate\nCurrent Basic: ${formatINR(currentBasic)}\nFitment Factor: ${fitment}x\nNew Basic Pay: ${formatINR(newBasic)}\nNew Gross Salary: ${formatINR(newGross)}\nIncrease: ${formatINR(increase)} (${increasePercent}%)`;

  const jsonLd = useMemo(() => [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "8th Pay Commission Salary Calculator",
      url: "https://mypaisahq.com/8th-pay-commission",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      description: "Calculate your revised salary under the 8th CPC with fitment factor, HRA, DA and Transport Allowance for all pay levels.",
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
        { "@type": "ListItem", position: 2, name: "8th Pay Commission Calculator", item: "https://mypaisahq.com/8th-pay-commission" },
      ],
    },
  ], []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <SEOHead
        title="8th Pay Commission Salary Calculator 2026 - My Paisa HQ"
        description="Calculate your revised salary under the 8th Pay Commission with expected fitment factor (2.28x-2.86x). Compare old 7th CPC vs new 8th CPC basic pay, DA, HRA and gross salary for all pay levels."
        canonicalPath="/8th-pay-commission"
        jsonLd={jsonLd}
      />
      <Breadcrumb currentPage="8th Pay Commission Calculator" />
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">8th Pay Commission Salary Calculator</h1>
        <p className="text-muted-foreground">Estimate your revised salary based on the expected 8th CPC fitment factor</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Input Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Pay Level (7th CPC)</Label>
              <Select
                value={selectedLevel}
                onValueChange={(v) => {
                  setSelectedLevel(v);
                  const vals = getPayValuesForLevel(v);
                  if (vals.length > 0) setSelectedPay(vals[0].toString());
                }}
              >
                <SelectTrigger data-testid="select-pay-level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {payLevels.map((l) => (
                    <SelectItem key={l.level} value={l.level}>
                      Level {l.level} ({formatINR(l.entryPay)} - {formatINR(l.maxPay)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Current Basic Pay</Label>
              <Select value={selectedPay} onValueChange={setSelectedPay}>
                <SelectTrigger data-testid="select-basic-pay">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {payValues.map((v) => (
                    <SelectItem key={v} value={v.toString()}>
                      {formatINR(v)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label>Fitment Factor</Label>
                <span className="text-sm font-semibold text-primary">{fitment.toFixed(2)}x</span>
              </div>
              <Slider
                min={1.83}
                max={2.86}
                step={0.01}
                value={[fitment]}
                onValueChange={([v]) => setFitment(v)}
                data-testid="slider-fitment"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1.83x</span>
                <span>2.86x</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>HRA City Type</Label>
              <Select value={cityType} onValueChange={(v) => setCityType(v as "X" | "Y" | "Z")}>
                <SelectTrigger data-testid="select-city-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="X">X - Metro (Delhi, Mumbai, etc.)</SelectItem>
                  <SelectItem value="Y">Y - Other Cities</SelectItem>
                  <SelectItem value="Z">Z - Remaining Areas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <ResultCard title="Salary Comparison" copyText={copyText} id="pay-commission">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Component</th>
                  <th className="text-right py-2 font-medium">Old (7th CPC)</th>
                  <th className="text-right py-2 font-medium text-primary">New (8th CPC)</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-2">Basic Pay</td>
                  <td className="text-right py-2" data-testid="text-old-basic">{formatINR(currentBasic)}</td>
                  <td className="text-right py-2 font-medium text-primary" data-testid="text-new-basic">{formatINR(newBasic)}</td>
                </tr>
                <tr>
                  <td className="py-2">DA (50% / 0%)</td>
                  <td className="text-right py-2">{formatINR(oldDA)}</td>
                  <td className="text-right py-2 text-primary">{formatINR(newDA)}</td>
                </tr>
                <tr>
                  <td className="py-2">HRA ({cityType})</td>
                  <td className="text-right py-2">{formatINR(oldHRA)}</td>
                  <td className="text-right py-2 text-primary">{formatINR(newHRA)}</td>
                </tr>
                <tr>
                  <td className="py-2">Transport Allowance</td>
                  <td className="text-right py-2">{formatINR(oldTA)}</td>
                  <td className="text-right py-2 text-primary">{formatINR(newTA)}</td>
                </tr>
                <tr className="font-semibold border-t-2">
                  <td className="py-3">Gross Salary</td>
                  <td className="text-right py-3" data-testid="text-old-gross">{formatINR(oldGross)}</td>
                  <td className="text-right py-3 text-primary" data-testid="text-new-gross">{formatINR(newGross)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 rounded-md bg-primary/10 flex items-center justify-between gap-2">
            <span className="text-sm font-medium">Monthly Increase</span>
            <span className="text-lg font-bold text-primary" data-testid="text-increase">
              {formatINR(increase)} ({increasePercent}%)
            </span>
          </div>
        </ResultCard>
      </div>

      <RelatedTools tools={relatedTools} />
      <FAQSection faqs={faqs} />
    </div>
  );
}
