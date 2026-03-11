import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResultCard from "@/components/result-card";
import SEOHead from "@/components/seo-head";
import Breadcrumb from "@/components/breadcrumb";
import FAQSection, { type FAQItem } from "@/components/faq-section";
import RelatedTools from "@/components/related-tools";
import { formatINR } from "@/lib/formatters";

const faqs: FAQItem[] = [
  {
    question: "How to calculate salary hike percentage?",
    answer: "Salary hike percentage = ((New Salary - Old Salary) / Old Salary) x 100. For example, if your CTC increased from Rs. 10,00,000 to Rs. 12,00,000, the hike percentage is ((12,00,000 - 10,00,000) / 10,00,000) x 100 = 20%.",
  },
  {
    question: "What is a good salary hike percentage in India?",
    answer: "In India, the average annual salary hike is typically 8-12% for the IT industry. A hike of 15-20% is considered good, while 25%+ is excellent and usually happens when switching companies. During appraisals, most companies offer 5-15% based on performance ratings. Top performers and those in high-demand roles can negotiate 20-30%.",
  },
  {
    question: "How to calculate new salary after hike?",
    answer: "New Salary = Current Salary x (1 + Hike Percentage / 100). For example, if your current CTC is Rs. 8,00,000 and you receive a 15% hike: New CTC = 8,00,000 x (1 + 15/100) = 8,00,000 x 1.15 = Rs. 9,20,000. The monthly increase would be (9,20,000 - 8,00,000) / 12 = Rs. 10,000.",
  },
  {
    question: "Should I negotiate salary based on CTC or in-hand salary?",
    answer: "Always negotiate based on CTC (Cost to Company) as it represents the total compensation. However, understand the CTC breakup — a high CTC with large variable components or retiral benefits may result in lower monthly in-hand salary. Ask for the complete CTC structure including basic pay, HRA, PF, variable pay, and other benefits before accepting an offer.",
  },
  {
    question: "How much hike should I ask when switching jobs in India?",
    answer: "When switching jobs in India, a standard hike expectation is 30-50% of your current CTC. For experienced professionals in high-demand domains (AI, cloud, cybersecurity), 50-80% hikes are achievable. Entry-level switches typically see 20-40% hikes. The key factors are your current compensation, market rate for the role, your experience, and the company's budget.",
  },
];

const relatedTools = [
  { href: "/salary", title: "In-Hand Salary / CTC", desc: "Break down your new CTC into take-home salary" },
  { href: "/income-tax", title: "Income Tax Calculator", desc: "Check tax impact of your new salary" },
  { href: "/sip", title: "SIP Returns Calculator", desc: "Invest your increment — see how it grows" },
];

export default function Hike() {
  const [currentCTC, setCurrentCTC] = useState(1000000);
  const [hikePercent, setHikePercent] = useState(20);
  const [desiredCTC, setDesiredCTC] = useState(1500000);

  const newCTC = Math.round(currentCTC * (1 + hikePercent / 100));
  const yearlyIncrease = newCTC - currentCTC;
  const monthlyIncrease = Math.round(yearlyIncrease / 12);

  const requiredHike = currentCTC > 0 ? (((desiredCTC - currentCTC) / currentCTC) * 100) : 0;
  const reverseYearlyIncrease = desiredCTC - currentCTC;
  const reverseMonthlyIncrease = Math.round(reverseYearlyIncrease / 12);

  const hikeSteps = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

  const copyText = `Salary Hike\nCurrent CTC: ${formatINR(currentCTC)}\nHike: ${hikePercent}%\nNew CTC: ${formatINR(newCTC)}\nMonthly Increase: ${formatINR(monthlyIncrease)}\nYearly Increase: ${formatINR(yearlyIncrease)}`;

  const jsonLd = useMemo(() => [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Salary Hike Calculator",
      url: "https://mypaisahq.com/hike",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      description: "Calculate new salary after a hike percentage or find the hike needed to reach a target CTC.",
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
        { "@type": "ListItem", position: 2, name: "Salary Hike Calculator", item: "https://mypaisahq.com/hike" },
      ],
    },
  ], []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <SEOHead
        title="Salary Hike Calculator India - My Paisa HQ"
        description="Calculate your new CTC after a salary hike percentage or find the hike needed to reach a target salary. Compare hike percentages from 5% to 50% with monthly and yearly increase amounts."
        canonicalPath="/hike"
        jsonLd={jsonLd}
      />
      <Breadcrumb currentPage="Salary Hike Calculator" />
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Salary Hike Calculator</h1>
        <p className="text-muted-foreground">Calculate your new salary after a hike or find the hike needed for a target</p>
      </div>

      <Tabs defaultValue="forward">
        <TabsList className="mb-6">
          <TabsTrigger value="forward" data-testid="tab-forward-hike">Calculate New Salary</TabsTrigger>
          <TabsTrigger value="reverse" data-testid="tab-reverse-hike">Find Required Hike</TabsTrigger>
        </TabsList>

        <TabsContent value="forward">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Input Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label>Current CTC (Annual)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={currentCTC}
                    onChange={(e) => setCurrentCTC(Math.max(0, Number(e.target.value)))}
                    data-testid="input-current-ctc"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hike Percentage (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={hikePercent}
                    onChange={(e) => setHikePercent(Math.max(0, Number(e.target.value)))}
                    data-testid="input-hike-percent"
                  />
                </div>
              </CardContent>
            </Card>

            <ResultCard title="Hike Results" copyText={copyText} id="hike-forward">
              <div className="space-y-4">
                <div className="p-4 rounded-md bg-primary/10 text-center">
                  <p className="text-sm text-muted-foreground mb-1">New CTC</p>
                  <p className="text-3xl font-bold text-primary" data-testid="text-new-ctc">{formatINR(newCTC)}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-md bg-muted/50 text-center">
                    <p className="text-xs text-muted-foreground">Monthly Increase</p>
                    <p className="text-lg font-semibold" data-testid="text-monthly-increase">{formatINR(monthlyIncrease)}</p>
                  </div>
                  <div className="p-3 rounded-md bg-muted/50 text-center">
                    <p className="text-xs text-muted-foreground">Yearly Increase</p>
                    <p className="text-lg font-semibold" data-testid="text-yearly-increase">{formatINR(yearlyIncrease)}</p>
                  </div>
                </div>
              </div>
            </ResultCard>
          </div>
        </TabsContent>

        <TabsContent value="reverse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Input Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label>Current CTC (Annual)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={currentCTC}
                    onChange={(e) => setCurrentCTC(Math.max(0, Number(e.target.value)))}
                    data-testid="input-current-ctc-reverse"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Desired CTC (Annual)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={desiredCTC}
                    onChange={(e) => setDesiredCTC(Math.max(0, Number(e.target.value)))}
                    data-testid="input-desired-ctc"
                  />
                </div>
              </CardContent>
            </Card>

            <ResultCard title="Required Hike" copyText={`Required Hike: ${requiredHike.toFixed(1)}%`} id="hike-reverse">
              <div className="space-y-4">
                <div className="p-4 rounded-md bg-primary/10 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Required Hike</p>
                  <p className="text-3xl font-bold text-primary" data-testid="text-required-hike">
                    {requiredHike.toFixed(1)}%
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-md bg-muted/50 text-center">
                    <p className="text-xs text-muted-foreground">Monthly Increase</p>
                    <p className="text-lg font-semibold">{formatINR(reverseMonthlyIncrease)}</p>
                  </div>
                  <div className="p-3 rounded-md bg-muted/50 text-center">
                    <p className="text-xs text-muted-foreground">Yearly Increase</p>
                    <p className="text-lg font-semibold">{formatINR(reverseYearlyIncrease)}</p>
                  </div>
                </div>
              </div>
            </ResultCard>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hike Comparison Table</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Hike %</th>
                    <th className="text-right py-2 font-medium">New CTC</th>
                    <th className="text-right py-2 font-medium">Monthly Increase</th>
                    <th className="text-right py-2 font-medium">Yearly Increase</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {hikeSteps.map((h) => {
                    const nc = Math.round(currentCTC * (1 + h / 100));
                    const yi = nc - currentCTC;
                    const mi = Math.round(yi / 12);
                    return (
                      <tr key={h} className={h === hikePercent ? "bg-primary/5" : ""}>
                        <td className="py-2">{h}%</td>
                        <td className="text-right py-2">{formatINR(nc)}</td>
                        <td className="text-right py-2">{formatINR(mi)}</td>
                        <td className="text-right py-2">{formatINR(yi)}</td>
                      </tr>
                    );
                  })}
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
