import { useMemo } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import SEOHead from "@/components/seo-head";
import Breadcrumb from "@/components/breadcrumb";
import { salaryLpaData } from "@/data/salary-lpa";
import { formatINR } from "@/lib/formatters";

function calcApproxInHand(ctc: number): number {
  const basic = ctc * 0.4;
  const pf = Math.min(basic * 0.12, 21600);
  const employerPF = pf;
  const gross = ctc - employerPF;
  const taxable = Math.max(0, gross - 75000 - pf);
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
    if (taxable <= prev) break;
    tax += (Math.min(taxable, slab.limit) - prev) * slab.rate;
    prev = slab.limit;
  }
  if (taxable <= 1200000) tax = 0;
  const totalTax = Math.round(tax * 1.04);
  return Math.round((gross - totalTax - pf - 2400) / 12);
}

export default function SalaryHub() {
  const jsonLd = useMemo(() => [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Salary Calculator by LPA 2025-26",
      url: "https://mypaisahq.com/salary-calculator",
      description: "Calculate in-hand salary for any CTC from 3 LPA to 50 LPA. Pre-filled salary breakdowns with PF, tax, and take-home under old and new regime.",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://mypaisahq.com" },
        { "@type": "ListItem", position: 2, name: "Salary Calculator by CTC", item: "https://mypaisahq.com/salary-calculator" },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Salary Calculators by CTC",
      itemListElement: salaryLpaData.map((lpa, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${lpa.label} Salary Calculator`,
        url: `https://mypaisahq.com/salary-calculator/${lpa.slug}`,
      })),
    },
  ], []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <SEOHead
        title="Salary Calculator by LPA 2025-26 — In-Hand Salary at Every CTC | My Paisa HQ"
        description="Calculate in-hand take-home salary for any CTC from 3 LPA to 50 LPA. Pre-filled salary breakdowns with basic pay, HRA, PF, professional tax, and income tax under old and new regime."
        canonicalPath="/salary-calculator"
        jsonLd={jsonLd}
      />
      <Breadcrumb currentPage="Salary Calculator by CTC" />
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" data-testid="heading-salary-hub">In-Hand Salary Calculator by LPA</h1>
        <p className="text-muted-foreground">Find out exactly how much you take home at every salary level</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {salaryLpaData.map((lpa) => {
          const approxInHand = calcApproxInHand(lpa.annualCTC);
          return (
            <Link key={lpa.slug} href={`/salary-calculator/${lpa.slug}`}>
              <Card className="h-full hover:border-primary/50 cursor-pointer transition-colors" data-testid={`link-salary-${lpa.slug}`}>
                <CardContent className="pt-4 pb-3 px-4">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{lpa.label} Salary</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        ≈ {formatINR(approxInHand)}/month in-hand
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 p-4 rounded-lg border">
        <h2 className="text-base font-semibold mb-2">How CTC to In-Hand Salary Works</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Your CTC (Cost to Company) includes everything your employer spends on you — basic salary, HRA, employer PF, insurance, and other benefits. Your in-hand (take-home) salary is what you actually receive after deducting employee PF, professional tax, and income tax. Typically, in-hand salary is 65-75% of CTC depending on your tax regime and deductions. Select your CTC above to see the exact breakdown.
        </p>
      </div>

      <div className="mt-4 text-center">
        <Link href="/salary" className="text-sm text-primary hover:underline" data-testid="link-salary-generic">
          Use the custom salary calculator instead →
        </Link>
      </div>
    </div>
  );
}
