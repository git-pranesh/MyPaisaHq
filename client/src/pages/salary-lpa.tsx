import { useState, useMemo } from "react";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight } from "lucide-react";
import ResultCard from "@/components/result-card";
import SEOHead from "@/components/seo-head";
import Breadcrumb from "@/components/breadcrumb";
import FAQSection, { type FAQItem } from "@/components/faq-section";
import { formatINR } from "@/lib/formatters";
import { getLpaBySlug, salaryLpaData } from "@/data/salary-lpa";
import NotFound from "@/pages/not-found";

function calcNewRegimeTax(taxableIncome: number): number {
  const slabs = [
    { limit: 400000, rate: 0 },
    { limit: 800000, rate: 0.05 },
    { limit: 1200000, rate: 0.10 },
    { limit: 1600000, rate: 0.15 },
    { limit: 2000000, rate: 0.20 },
    { limit: 2400000, rate: 0.25 },
    { limit: Infinity, rate: 0.30 },
  ];
  let tax = 0, prev = 0;
  for (const slab of slabs) {
    if (taxableIncome <= prev) break;
    tax += (Math.min(taxableIncome, slab.limit) - prev) * slab.rate;
    prev = slab.limit;
  }
  if (taxableIncome <= 1200000) tax = 0;
  return tax;
}

function calcOldRegimeTax(taxableIncome: number): number {
  const slabs = [
    { limit: 250000, rate: 0 },
    { limit: 500000, rate: 0.05 },
    { limit: 1000000, rate: 0.20 },
    { limit: Infinity, rate: 0.30 },
  ];
  let tax = 0, prev = 0;
  for (const slab of slabs) {
    if (taxableIncome <= prev) break;
    tax += (Math.min(taxableIncome, slab.limit) - prev) * slab.rate;
    prev = slab.limit;
  }
  if (taxableIncome <= 500000) tax = 0;
  return tax;
}

const standardSalaryFaqs: FAQItem[] = [
  { question: "How to calculate in-hand salary from CTC?", answer: "In-hand salary = CTC minus employer PF contribution minus employee PF minus professional tax minus income tax. First, calculate basic salary (typically 40-50% of CTC). Then compute HRA, PF deductions, professional tax, and income tax under your chosen regime. The remaining amount is your monthly in-hand (take-home) salary." },
  { question: "What is the difference between CTC and in-hand salary?", answer: "CTC (Cost to Company) is the total amount your employer spends on you annually, including basic pay, HRA, employer PF, insurance, bonuses and other benefits. In-hand salary is what you actually receive in your bank account after all deductions like employee PF, professional tax, and income tax. Typically, in-hand salary is 65-75% of CTC." },
  { question: "What is the PF contribution limit in India?", answer: "The statutory PF contribution is 12% of basic salary from both employer and employee. The PF contribution is calculated on basic salary up to a ceiling of Rs. 15,000 per month, which means the maximum PF contribution is Rs. 1,800/month or Rs. 21,600/year." },
  { question: "What is professional tax and how much is deducted?", answer: "Professional tax is a state-level tax on income earned through employment or profession. The maximum amount that can be levied is Rs. 2,500 per year. Different states have different slabs — for example, Maharashtra charges Rs. 200/month (Rs. 2,400/year)." },
  { question: "Which tax regime is better — old or new?", answer: "The new tax regime (FY 2025-26) offers lower slab rates and no tax up to Rs. 12 lakhs income but does not allow most deductions. The old regime has higher rates but allows deductions under 80C, 80D, HRA, etc. If your total deductions exceed Rs. 3-4 lakhs, the old regime might save more." },
];

export default function SalaryLPA() {
  const { lpa } = useParams<{ lpa: string }>();
  const lpaData = getLpaBySlug(lpa || "");

  if (!lpaData) {
    return <NotFound />;
  }

  return <SalaryLPACalculator key={lpaData.slug} lpaData={lpaData} />;
}

function SalaryLPACalculator({ lpaData }: { lpaData: NonNullable<ReturnType<typeof getLpaBySlug>> }) {
  const [ctc, setCTC] = useState(lpaData.annualCTC);
  const [basicPercent, setBasicPercent] = useState(40);
  const [isMetro, setIsMetro] = useState(false);
  const [pfEnabled, setPfEnabled] = useState(true);
  const [professionalTax, setProfessionalTax] = useState(2400);

  const basicAnnual = (ctc * basicPercent) / 100;
  const basicMonthly = basicAnnual / 12;
  const hraPercent = isMetro ? 50 : 40;
  const hraAnnual = (basicAnnual * hraPercent) / 100;
  const pfAnnual = pfEnabled ? Math.min(basicAnnual * 0.12, 21600) : 0;
  const employerPF = pfEnabled ? Math.min(basicAnnual * 0.12, 21600) : 0;
  const grossAnnual = ctc - employerPF;
  const otherAllowances = grossAnnual - basicAnnual - hraAnnual;

  const stdDeductionNew = 75000;
  const stdDeductionOld = 50000;
  const taxableNew = Math.max(0, grossAnnual - stdDeductionNew - pfAnnual);
  const section80C = pfEnabled ? Math.min(pfAnnual, 150000) : 0;
  const taxableOld = Math.max(0, grossAnnual - stdDeductionOld - section80C);

  const totalTaxNew = Math.round(calcNewRegimeTax(taxableNew) * 1.04);
  const totalTaxOld = Math.round(calcOldRegimeTax(taxableOld) * 1.04);

  const inHandNewMonthly = Math.round((grossAnnual - totalTaxNew - pfAnnual - professionalTax) / 12);
  const inHandOldMonthly = Math.round((grossAnnual - totalTaxOld - pfAnnual - professionalTax) / 12);

  const copyText = `${lpaData.label} Salary Breakdown\nAnnual CTC: ${formatINR(ctc)}\nBasic: ${formatINR(basicAnnual)}/yr\nHRA: ${formatINR(hraAnnual)}/yr\nPF (Employee): ${formatINR(pfAnnual)}/yr\nNew Regime Tax: ${formatINR(totalTaxNew)}\nIn-Hand (New): ${formatINR(inHandNewMonthly)}/month\nOld Regime Tax: ${formatINR(totalTaxOld)}\nIn-Hand (Old): ${formatINR(inHandOldMonthly)}/month`;

  const nearbyLpaData = lpaData.nearbyLpa
    .map((val) => salaryLpaData.find((l) => l.lpa === val))
    .filter(Boolean);

  const lpaFaqs: FAQItem[] = [
    {
      question: `What is the in-hand salary for ${lpaData.label}?`,
      answer: `For a CTC of ${lpaData.label} (₹${lpaData.annualCTC.toLocaleString("en-IN")}/year), the approximate in-hand salary is ₹${inHandNewMonthly.toLocaleString("en-IN")}/month under the new tax regime and ₹${inHandOldMonthly.toLocaleString("en-IN")}/month under the old regime (with 40% basic, PF enabled, non-metro city).`,
    },
    {
      question: `Which tax regime is better at ${lpaData.label}?`,
      answer: inHandNewMonthly >= inHandOldMonthly
        ? `At ${lpaData.label} CTC, the new tax regime gives you a higher take-home of ₹${inHandNewMonthly.toLocaleString("en-IN")}/month compared to ₹${inHandOldMonthly.toLocaleString("en-IN")}/month under the old regime. The new regime is better unless you have significant deductions beyond PF.`
        : `At ${lpaData.label} CTC, the old tax regime gives you a higher take-home of ₹${inHandOldMonthly.toLocaleString("en-IN")}/month compared to ₹${inHandNewMonthly.toLocaleString("en-IN")}/month under the new regime. Consider the old regime if you claim HRA, 80C, and 80D deductions.`,
    },
  ];

  const allFaqs = [...lpaFaqs, ...standardSalaryFaqs];

  const jsonLd = useMemo(() => [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: `${lpaData.label} In-Hand Salary Calculator 2025-26`,
      url: `https://mypaisahq.com/salary-calculator/${lpaData.slug}`,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      description: `Calculate in-hand salary from ${lpaData.label} CTC (₹${lpaData.annualCTC.toLocaleString("en-IN")}/year) with PF, tax, and regime comparison.`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://mypaisahq.com" },
        { "@type": "ListItem", position: 2, name: "Salary Calculator by CTC", item: "https://mypaisahq.com/salary-calculator" },
        { "@type": "ListItem", position: 3, name: `${lpaData.label} Salary`, item: `https://mypaisahq.com/salary-calculator/${lpaData.slug}` },
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
  ], [lpaData, allFaqs]);

  const BreakdownTable = ({ regime }: { regime: "new" | "old" }) => {
    const stdDed = regime === "new" ? stdDeductionNew : stdDeductionOld;
    const tax = regime === "new" ? totalTaxNew : totalTaxOld;
    const inHand = regime === "new" ? inHandNewMonthly : inHandOldMonthly;
    const taxableIncome = regime === "new" ? taxableNew : taxableOld;

    return (
      <div className="space-y-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Earnings</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-1.5 font-medium text-xs">Component</th>
                <th className="text-right py-1.5 font-medium text-xs">Monthly</th>
                <th className="text-right py-1.5 font-medium text-xs">Annual</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="py-1.5 text-sm">Basic Salary</td>
                <td className="text-right py-1.5 text-sm">{formatINR(Math.round(basicMonthly))}</td>
                <td className="text-right py-1.5 text-sm">{formatINR(Math.round(basicAnnual))}</td>
              </tr>
              <tr>
                <td className="py-1.5 text-sm">HRA</td>
                <td className="text-right py-1.5 text-sm">{formatINR(Math.round(hraAnnual / 12))}</td>
                <td className="text-right py-1.5 text-sm">{formatINR(Math.round(hraAnnual))}</td>
              </tr>
              <tr>
                <td className="py-1.5 text-sm">Other Allowances</td>
                <td className="text-right py-1.5 text-sm">{formatINR(Math.round(otherAllowances / 12))}</td>
                <td className="text-right py-1.5 text-sm">{formatINR(Math.round(otherAllowances))}</td>
              </tr>
              <tr className="font-medium border-t">
                <td className="py-1.5 text-sm">Gross Salary</td>
                <td className="text-right py-1.5 text-sm">{formatINR(Math.round(grossAnnual / 12))}</td>
                <td className="text-right py-1.5 text-sm">{formatINR(Math.round(grossAnnual))}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Deductions</p>
          <table className="w-full text-sm">
            <tbody className="divide-y">
              <tr>
                <td className="py-1.5 text-sm">PF (Employee)</td>
                <td className="text-right py-1.5 text-sm">{formatINR(Math.round(pfAnnual / 12))}</td>
                <td className="text-right py-1.5 text-sm">{formatINR(Math.round(pfAnnual))}</td>
              </tr>
              <tr>
                <td className="py-1.5 text-sm">Professional Tax</td>
                <td className="text-right py-1.5 text-sm">{formatINR(Math.round(professionalTax / 12))}</td>
                <td className="text-right py-1.5 text-sm">{formatINR(Math.round(professionalTax))}</td>
              </tr>
              <tr>
                <td className="py-1.5 text-sm">Income Tax + Cess</td>
                <td className="text-right py-1.5 text-sm">{formatINR(Math.round(tax / 12))}</td>
                <td className="text-right py-1.5 text-sm">{formatINR(tax)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="border-t-2 pt-2">
          <table className="w-full text-sm">
            <tbody>
              <tr className="font-semibold">
                <td className="py-1.5">In-Hand Salary</td>
                <td className="text-right py-1.5 text-primary">{formatINR(inHand)}</td>
                <td className="text-right py-1.5 text-primary">{formatINR(inHand * 12)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="text-xs text-muted-foreground p-2 rounded-md bg-muted/50">
          Std Deduction: {formatINR(stdDed)} | {regime === "old" ? `80C: ${formatINR(section80C)} | ` : ""}
          Taxable Income: {formatINR(Math.round(taxableIncome))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <SEOHead
        title={`${lpaData.label} In-Hand Salary Calculator 2025-26 | Monthly Take-Home | My Paisa HQ`}
        description={`${lpaData.label} CTC (₹${lpaData.annualCTC.toLocaleString("en-IN")}/year) in-hand salary breakdown with PF, professional tax, income tax. Compare old vs new tax regime. Pre-filled for ${lpaData.label}.`}
        canonicalPath={`/salary-calculator/${lpaData.slug}`}
        jsonLd={jsonLd}
      />
      <Breadcrumb
        currentPage={`${lpaData.label} Salary`}
        parent={{ label: "Salary Calculator by CTC", href: "/salary-calculator" }}
      />
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" data-testid="heading-salary-lpa">{lpaData.label} In-Hand Salary Calculator</h1>
        <p className="text-muted-foreground">CTC of ₹{lpaData.annualCTC.toLocaleString("en-IN")}/year — see your monthly take-home for FY 2025-26</p>
      </div>

      <div className="mb-6 p-4 rounded-lg border">
        <p className="text-sm text-muted-foreground leading-relaxed">
          If your CTC is {lpaData.label}, here's your exact in-hand salary breakdown for FY 2025-26. The calculator below shows your monthly take-home after PF, professional tax, and income tax deductions under both old and new tax regimes.
        </p>
        <a href="#calculator" className="text-sm text-primary hover:underline mt-2 inline-block" data-testid="link-see-breakdown">
          See My Breakdown →
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6" id="calculator">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Input Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Annual CTC</Label>
              <Input type="number" min={0} value={ctc} onChange={(e) => setCTC(Math.max(0, Number(e.target.value)))} data-testid="input-ctc" />
            </div>
            <div className="space-y-2">
              <Label>Basic Salary (% of CTC)</Label>
              <Input type="number" min={1} max={100} value={basicPercent} onChange={(e) => setBasicPercent(Math.max(1, Math.min(100, Number(e.target.value))))} data-testid="input-basic-percent" />
            </div>
            <div className="space-y-2">
              <Label>Professional Tax (Annual)</Label>
              <Input type="number" min={0} value={professionalTax} onChange={(e) => setProfessionalTax(Math.max(0, Number(e.target.value)))} data-testid="input-prof-tax" />
            </div>
            <div className="flex items-center justify-between gap-2">
              <Label>Metro City (HRA 50%)</Label>
              <Switch checked={isMetro} onCheckedChange={setIsMetro} data-testid="switch-metro" />
            </div>
            <div className="flex items-center justify-between gap-2">
              <Label>PF Contribution (12%)</Label>
              <Switch checked={pfEnabled} onCheckedChange={setPfEnabled} data-testid="switch-pf" />
            </div>
            <p className="text-xs text-muted-foreground">PF capped at statutory limit of ₹15,000/month basic (₹21,600/year max contribution)</p>
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          <Tabs defaultValue="new">
            <TabsList className="w-full">
              <TabsTrigger value="new" className="flex-1" data-testid="tab-new-regime">New Regime</TabsTrigger>
              <TabsTrigger value="old" className="flex-1" data-testid="tab-old-regime">Old Regime</TabsTrigger>
            </TabsList>
            <TabsContent value="new">
              <ResultCard title="New Regime Breakdown" copyText={copyText} id="salary-new">
                <BreakdownTable regime="new" />
              </ResultCard>
            </TabsContent>
            <TabsContent value="old">
              <ResultCard title="Old Regime Breakdown" copyText={copyText} id="salary-old">
                <BreakdownTable regime="old" />
              </ResultCard>
            </TabsContent>
          </Tabs>

          <div className="mt-4 p-4 rounded-md bg-primary/10">
            <p className="text-sm font-medium mb-2">Regime Comparison</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">New Regime</p>
                <p className="text-lg font-bold text-primary" data-testid="text-inhand-new">{formatINR(inHandNewMonthly)}/mo</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Old Regime</p>
                <p className="text-lg font-bold" data-testid="text-inhand-old">{formatINR(inHandOldMonthly)}/mo</p>
              </div>
            </div>
            <p className="text-xs text-center mt-2 text-muted-foreground">
              {inHandNewMonthly >= inHandOldMonthly ? "New regime saves you more!" : "Old regime saves you more!"}
            </p>
          </div>
        </div>
      </div>

      <FAQSection faqs={allFaqs} />

      {nearbyLpaData.length > 0 && (
        <div className="mt-8">
          <h2 className="text-base font-semibold mb-3">Compare with Other LPA</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {nearbyLpaData.map((l) => l && (
              <Link key={l.slug} href={`/salary-calculator/${l.slug}`}>
                <Card className="h-full hover:border-primary/50 cursor-pointer transition-colors" data-testid={`link-nearby-${l.slug}`}>
                  <CardContent className="pt-4 pb-3 px-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">{l.label}</p>
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
        <Link href="/salary" className="text-sm text-primary hover:underline" data-testid="link-salary-generic">
          Use the custom salary calculator instead →
        </Link>
      </div>
    </div>
  );
}
