import { useState, useMemo } from "react";
import { useParams, Link, Redirect } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import ResultCard from "@/components/result-card";
import SEOHead from "@/components/seo-head";
import Breadcrumb from "@/components/breadcrumb";
import { formatINR } from "@/lib/formatters";
import { getCityBySlug, hraCities } from "@/data/hra-cities";

export default function HRACity() {
  const { city } = useParams<{ city: string }>();
  const cityData = getCityBySlug(city || "");

  if (!cityData) {
    return <Redirect to="/hra-calculator" />;
  }

  return <HRACityCalculator key={cityData.slug} cityData={cityData} />;
}

function HRACityCalculator({ cityData }: { cityData: NonNullable<ReturnType<typeof getCityBySlug>> }) {
  const [basicSalary, setBasicSalary] = useState(cityData.typicalBasic);
  const [hraReceived, setHraReceived] = useState(Math.round(cityData.typicalBasic * cityData.hraPercent / 100));
  const [rentPaid, setRentPaid] = useState(cityData.avgRent);

  const percentOfBasic = (basicSalary * cityData.hraPercent) / 100;
  const rentMinus10 = Math.max(0, rentPaid - basicSalary * 0.1);
  const exemption = Math.min(hraReceived, percentOfBasic, rentMinus10);
  const taxableHRA = Math.max(0, hraReceived - exemption);

  const copyText = `HRA Exemption - ${cityData.name}\nBasic Salary: ${formatINR(basicSalary)}/mo\nHRA Received: ${formatINR(hraReceived)}/mo\nRent Paid: ${formatINR(rentPaid)}/mo\nCity: ${cityData.name} (${cityData.isMetro ? "Metro" : "Non-Metro"} — ${cityData.hraPercent}%)\n\nExemption Calculation:\n(a) Actual HRA: ${formatINR(hraReceived)}\n(b) ${cityData.hraPercent}% of Basic: ${formatINR(Math.round(percentOfBasic))}\n(c) Rent - 10% Basic: ${formatINR(Math.round(rentMinus10))}\nHRA Exempt: ${formatINR(Math.round(exemption))}/mo (${formatINR(Math.round(exemption * 12))}/yr)\nTaxable HRA: ${formatINR(Math.round(taxableHRA))}/mo`;

  const nearbyCityData = cityData.nearbyCities
    .map((slug) => hraCities.find((c) => c.slug === slug))
    .filter(Boolean);

  const jsonLd = useMemo(() => [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: `HRA Calculator ${cityData.name}`,
      url: `https://mypaisahq.com/hra-calculator/${cityData.slug}`,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      description: `Calculate HRA exemption under Section 10(13A) for ${cityData.name}. ${cityData.isMetro ? "Metro" : "Non-metro"} city with ${cityData.hraPercent}% HRA exemption.`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://mypaisahq.com" },
        { "@type": "ListItem", position: 2, name: "HRA Calculator by City", item: "https://mypaisahq.com/hra-calculator" },
        { "@type": "ListItem", position: 3, name: `HRA Calculator ${cityData.name}`, item: `https://mypaisahq.com/hra-calculator/${cityData.slug}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `Is ${cityData.name} a metro city for HRA?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: cityData.isMetro
              ? `Yes, ${cityData.name} is classified as a metro city for HRA purposes under Section 10(13A). HRA exemption is calculated at 50% of basic salary.`
              : `No, ${cityData.name} is classified as a non-metro city for HRA purposes. HRA exemption is calculated at 40% of basic salary. Only Mumbai, Delhi, Kolkata, and Chennai are metros.`,
          },
        },
        {
          "@type": "Question",
          name: `What is the HRA exemption percentage for ${cityData.name}?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `The HRA exemption for ${cityData.name} is ${cityData.hraPercent}% of basic salary (${cityData.isMetro ? "metro" : "non-metro"} rate). The actual exemption is the minimum of: actual HRA received, ${cityData.hraPercent}% of basic salary, and rent paid minus 10% of basic salary.`,
          },
        },
      ],
    },
  ], [cityData]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <SEOHead
        title={`HRA Calculator ${cityData.name} - ${cityData.isMetro ? "Metro" : "Non-Metro"} (${cityData.hraPercent}%) | My Paisa HQ`}
        description={`Calculate HRA exemption for ${cityData.name} under Section 10(13A). ${cityData.name} is a ${cityData.isMetro ? "metro" : "non-metro"} city with ${cityData.hraPercent}% HRA on basic salary. Pre-filled with typical ${cityData.name} rent and salary data.`}
        canonicalPath={`/hra-calculator/${cityData.slug}`}
        jsonLd={jsonLd}
      />
      <Breadcrumb
        currentPage={`HRA Calculator ${cityData.name}`}
        parent={{ label: "HRA Calculator by City", href: "/hra-calculator" }}
      />
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">HRA Calculator — {cityData.name}</h1>
        <p className="text-muted-foreground">
          {cityData.isMetro ? "Metro city" : "Non-metro city"} — {cityData.hraPercent}% of basic salary for HRA exemption under Section 10(13A)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Details ({cityData.name})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Monthly Basic Salary</Label>
              <Input
                type="number"
                min={0}
                value={basicSalary}
                onChange={(e) => setBasicSalary(Math.max(0, Number(e.target.value)))}
                data-testid="input-basic-salary"
              />
            </div>
            <div className="space-y-2">
              <Label>Monthly HRA Received</Label>
              <Input
                type="number"
                min={0}
                value={hraReceived}
                onChange={(e) => setHraReceived(Math.max(0, Number(e.target.value)))}
                data-testid="input-hra-received"
              />
            </div>
            <div className="space-y-2">
              <Label>Monthly Rent Paid</Label>
              <Input
                type="number"
                min={0}
                value={rentPaid}
                onChange={(e) => setRentPaid(Math.max(0, Number(e.target.value)))}
                data-testid="input-rent-paid"
              />
            </div>
            <div className="p-3 rounded-md bg-muted/50 text-xs text-muted-foreground">
              <p><strong>{cityData.name}</strong> is a {cityData.isMetro ? "metro" : "non-metro"} city → HRA at <strong>{cityData.hraPercent}%</strong> of basic salary</p>
            </div>
          </CardContent>
        </Card>

        <ResultCard title={`HRA Exemption — ${cityData.name}`} copyText={copyText} id="hra-city">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>(a) Actual HRA received</span>
                <span className="font-medium">{formatINR(hraReceived)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>(b) {cityData.hraPercent}% of basic salary</span>
                <span className="font-medium">{formatINR(Math.round(percentOfBasic))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>(c) Rent - 10% of basic</span>
                <span className="font-medium">{formatINR(Math.round(rentMinus10))}</span>
              </div>
            </div>
            <div className="border-t-2 pt-3">
              <div className="flex justify-between text-sm font-semibold">
                <span>HRA Exempt (per month)</span>
                <span className="text-primary" data-testid="text-hra-exempt">{formatINR(Math.round(exemption))}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold mt-1">
                <span>HRA Exempt (per year)</span>
                <span className="text-primary">{formatINR(Math.round(exemption * 12))}</span>
              </div>
              <div className="flex justify-between text-sm mt-2 text-muted-foreground">
                <span>Taxable HRA</span>
                <span>{formatINR(Math.round(taxableHRA))}/mo</span>
              </div>
            </div>
            <div className="p-3 rounded-md bg-primary/10 text-xs">
              Annual tax savings (30% slab): <strong>{formatINR(Math.round(exemption * 12 * 0.3))}</strong>
            </div>
          </div>
        </ResultCard>
      </div>

      <div className="mt-8 p-4 rounded-lg border">
        <h2 className="text-base font-semibold mb-2">About HRA in {cityData.name}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{cityData.description}</p>
      </div>

      {nearbyCityData.length > 0 && (
        <div className="mt-8">
          <h2 className="text-base font-semibold mb-3">HRA Calculator for Nearby Cities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {nearbyCityData.map((c) => c && (
              <Link key={c.slug} href={`/hra-calculator/${c.slug}`}>
                <Card className="h-full hover:border-primary/50 cursor-pointer transition-colors" data-testid={`link-nearby-${c.slug}`}>
                  <CardContent className="pt-4 pb-3 px-4">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium">{c.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{c.isMetro ? "Metro" : "Non-metro"} — {c.hraPercent}% HRA</p>
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
        <Link href="/hra" className="text-sm text-primary hover:underline" data-testid="link-hra-generic">
          Use the generic HRA calculator →
        </Link>
      </div>
    </div>
  );
}
