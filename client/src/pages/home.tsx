import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import {
  IndianRupee,
  Award,
  Calculator,
  Home as HomeIcon,
  TrendingUp,
  Receipt,
  PiggyBank,
  Scale,
} from "lucide-react";

const tools = [
  {
    href: "/8th-pay-commission",
    icon: Award,
    title: "8th Pay Commission",
    desc: "Calculate your revised salary under the 8th CPC with fitment factor and allowances",
  },
  {
    href: "/gratuity",
    icon: IndianRupee,
    title: "Gratuity Calculator",
    desc: "Compute gratuity amount, tax exemption and taxable portion based on your service",
  },
  {
    href: "/salary",
    icon: Calculator,
    title: "In-Hand Salary / CTC",
    desc: "Break down your CTC into monthly in-hand salary with old and new tax regime comparison",
  },
  {
    href: "/hra",
    icon: HomeIcon,
    title: "HRA Exemption",
    desc: "Find out how much HRA exemption you can claim and reduce your taxable income",
  },
  {
    href: "/hike",
    icon: TrendingUp,
    title: "Salary Hike",
    desc: "Calculate new CTC after a hike percentage or find the hike needed for a target salary",
  },
  {
    href: "/income-tax",
    icon: Receipt,
    title: "Income Tax FY 2025-26",
    desc: "Slab-wise tax breakup, cess, and side-by-side old vs new regime comparison",
  },
  {
    href: "/sip",
    icon: PiggyBank,
    title: "SIP Returns",
    desc: "Estimate maturity value of your SIP with optional step-up and visualize growth over time",
  },
  {
    href: "/loan-vs-sip",
    icon: Scale,
    title: "Loan vs SIP",
    desc: "Should you prepay your loan or invest in SIP? Compare total outflow and make smarter decisions",
  },
];

export default function Home() {
  return (
    <div>
      <section className="py-16 md:py-24 px-4" data-testid="hero-section">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <IndianRupee className="w-4 h-4" />
            Free Indian Finance Tools
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Smart tools for your
            <span className="text-primary block mt-1">financial decisions</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            8 powerful calculators covering salary, tax, investment and more — designed for Indian professionals.
            All calculations update in real-time.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href} data-testid={`card-tool-${tool.href.slice(1)}`}>
              <Card className="h-full hover-elevate active-elevate-2 cursor-pointer transition-all duration-200">
                <CardContent className="pt-6 pb-5 px-5 flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                    <tool.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">{tool.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{tool.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
