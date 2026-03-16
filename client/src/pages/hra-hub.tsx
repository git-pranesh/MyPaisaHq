import { useMemo } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, MapPin } from "lucide-react";
import SEOHead from "@/components/seo-head";
import Breadcrumb from "@/components/breadcrumb";
import { hraCities } from "@/data/hra-cities";

export default function HRAHub() {
  const metroCities = hraCities.filter((c) => c.isMetro);
  const nonMetroCities = hraCities.filter((c) => !c.isMetro);

  const jsonLd = useMemo(() => [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "HRA Calculator by City - India",
      url: "https://mypaisahq.com/hra-calculator",
      description: "Calculate HRA exemption under Section 10(13A) for 19 Indian cities. Metro cities (50% HRA) vs non-metro cities (40% HRA) with pre-filled city-specific data.",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://mypaisahq.com" },
        { "@type": "ListItem", position: 2, name: "HRA Calculator by City", item: "https://mypaisahq.com/hra-calculator" },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "HRA Calculators by City",
      itemListElement: hraCities.map((city, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `HRA Calculator ${city.name}`,
        url: `https://mypaisahq.com/hra-calculator/${city.slug}`,
      })),
    },
  ], []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <SEOHead
        title="HRA Calculator by City - Metro vs Non-Metro HRA Exemption | My Paisa HQ"
        description="Calculate HRA exemption under Section 10(13A) for 19 Indian cities. Know if your city qualifies for 50% (metro) or 40% (non-metro) HRA exemption and optimize your tax savings."
        canonicalPath="/hra-calculator"
        jsonLd={jsonLd}
      />
      <Breadcrumb currentPage="HRA Calculator by City" />
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">HRA Calculator by City</h1>
        <p className="text-muted-foreground">Select your city to calculate HRA exemption under Section 10(13A) with pre-filled city-specific data</p>
      </div>

      <div className="mb-4 p-4 rounded-lg bg-primary/10">
        <p className="text-sm">
          <strong>Metro vs Non-Metro:</strong> Only 4 cities — Mumbai, Delhi, Kolkata, and Chennai — qualify as metro for HRA purposes (50% of basic salary). All other cities get 40% exemption, regardless of population or cost of living.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          Metro Cities (50% HRA)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {metroCities.map((city) => (
            <Link key={city.slug} href={`/hra-calculator/${city.slug}`}>
              <Card className="h-full hover:border-primary/50 cursor-pointer transition-colors" data-testid={`link-hra-${city.slug}`}>
                <CardContent className="pt-4 pb-3 px-4">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{city.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">HRA at {city.hraPercent}% of basic | Avg rent: ₹{city.avgRent.toLocaleString("en-IN")}/mo</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          Non-Metro Cities (40% HRA)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {nonMetroCities.map((city) => (
            <Link key={city.slug} href={`/hra-calculator/${city.slug}`}>
              <Card className="h-full hover:border-primary/50 cursor-pointer transition-colors" data-testid={`link-hra-${city.slug}`}>
                <CardContent className="pt-4 pb-3 px-4">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{city.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">HRA at {city.hraPercent}% | Avg rent: ₹{city.avgRent.toLocaleString("en-IN")}/mo</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8 p-4 rounded-lg border">
        <h2 className="text-base font-semibold mb-2">How HRA Exemption Works</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          HRA (House Rent Allowance) exemption under Section 10(13A) is the minimum of three values: (1) Actual HRA received, (2) 50% of basic salary for metro cities or 40% for non-metro, and (3) Actual rent paid minus 10% of basic salary. The key legal distinction is metro vs non-metro classification — only Mumbai, Delhi, Kolkata, and Chennai qualify as metros. Choose your city above to get a calculator pre-filled with typical values for your location.
        </p>
      </div>

      <div className="mt-4 text-center">
        <Link href="/hra" className="text-sm text-primary hover:underline" data-testid="link-hra-generic">
          Use the generic HRA calculator instead →
        </Link>
      </div>
    </div>
  );
}
