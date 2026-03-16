import { useMemo } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import SEOHead from "@/components/seo-head";
import Breadcrumb from "@/components/breadcrumb";
import { sipGoals } from "@/data/sip-goals";
import { formatINRCompact, formatINR } from "@/lib/formatters";

export default function SIPHub() {
  const jsonLd = useMemo(() => [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "SIP Calculator by Goal 2025-26",
      url: "https://mypaisahq.com/sip-calculator",
      description: "Goal-based SIP calculators for retirement, house purchase, child education, emergency fund, car purchase, vacation, and wedding fund.",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://mypaisahq.com" },
        { "@type": "ListItem", position: 2, name: "SIP Calculator by Goal", item: "https://mypaisahq.com/sip-calculator" },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "SIP Calculators by Goal",
      itemListElement: sipGoals.map((goal, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `SIP for ${goal.name}`,
        url: `https://mypaisahq.com/sip-calculator/${goal.slug}`,
      })),
    },
  ], []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <SEOHead
        title="SIP Calculator by Goal 2025-26 — Monthly SIP for Every Financial Goal | My Paisa HQ"
        description="Goal-based SIP calculators pre-configured for retirement, house purchase, child education, emergency fund, car purchase, vacation, and wedding. See exactly how much SIP you need."
        canonicalPath="/sip-calculator"
        jsonLd={jsonLd}
      />
      <Breadcrumb currentPage="SIP Calculator by Goal" />
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" data-testid="heading-sip-hub">SIP Calculator by Financial Goal</h1>
        <p className="text-muted-foreground">Choose your financial goal to see the exact SIP amount needed with step-up option</p>
      </div>

      <div className="mb-4 p-4 rounded-lg bg-primary/10">
        <p className="text-sm">
          <strong>Goal-based investing</strong> works backward from your target amount. Instead of investing a random amount, you define your goal, set a timeline, and calculate the exact monthly SIP needed. Adding an annual step-up aligns investments with salary growth.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sipGoals.map((goal) => (
          <Link key={goal.slug} href={`/sip-calculator/${goal.slug}`}>
            <Card className="h-full hover:border-primary/50 cursor-pointer transition-colors" data-testid={`link-sip-${goal.slug}`}>
              <CardContent className="pt-5 pb-4 px-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{goal.emoji}</span>
                      <p className="text-sm font-medium">{goal.name}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Target: {formatINRCompact(goal.targetAmount)} | {goal.timelineYears} years | SIP: {formatINR(goal.monthlyInvestment)}/mo
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 p-4 rounded-lg border">
        <h2 className="text-base font-semibold mb-2">Why Goal-Based SIP Planning?</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Instead of investing a random amount, goal-based SIP planning works backward from your target amount. You define the goal (retirement, education, house), set a timeline, and the calculator tells you exactly how much to invest monthly. Adding an annual step-up (10-15%) aligns your investments with salary growth and dramatically reduces the starting SIP amount needed.
        </p>
      </div>

      <div className="mt-4 text-center">
        <Link href="/sip" className="text-sm text-primary hover:underline" data-testid="link-sip-generic">
          Use the general SIP returns calculator →
        </Link>
      </div>
    </div>
  );
}
