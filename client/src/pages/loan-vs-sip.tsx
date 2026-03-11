import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ResultCard from "@/components/result-card";
import SEOHead from "@/components/seo-head";
import Breadcrumb from "@/components/breadcrumb";
import FAQSection, { type FAQItem } from "@/components/faq-section";
import RelatedTools from "@/components/related-tools";
import { formatINR, formatINRCompact } from "@/lib/formatters";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

const faqs: FAQItem[] = [
  {
    question: "Should I prepay my home loan or invest in SIP?",
    answer: "Compare your loan interest rate with expected SIP returns. If your SIP can earn more than the loan interest rate (e.g., 12% SIP return vs 8.5% loan interest), investing in SIP is mathematically better. However, consider factors like tax benefits on home loan (Section 24 and 80C), risk tolerance, and the psychological comfort of being debt-free. A balanced approach of partial prepayment and partial SIP investment often works best.",
  },
  {
    question: "When is prepaying a loan better than SIP?",
    answer: "Prepaying the loan is better when: (1) Your loan interest rate is higher than expected SIP returns (e.g., personal loan at 14% vs SIP at 12%), (2) You want guaranteed returns (loan prepayment gives certain interest savings), (3) You're nearing retirement and want to reduce financial obligations, (4) You have high-interest loans like credit card debt or personal loans.",
  },
  {
    question: "How is EMI calculated for a loan?",
    answer: "EMI (Equated Monthly Installment) is calculated using the formula: EMI = P x R x (1+R)^N / ((1+R)^N - 1), where P = Principal loan amount, R = Monthly interest rate (annual rate / 12 / 100), N = Total number of monthly installments (tenure in years x 12). For example, a Rs. 30 lakh loan at 8.5% for 20 years results in an EMI of approximately Rs. 26,036.",
  },
  {
    question: "What factors should I consider in the loan vs SIP decision?",
    answer: "Key factors: (1) Interest rate differential — SIP returns minus loan interest rate, (2) Tax benefits — home loan interest deduction under Sec 24(b) up to Rs. 2 lakh and principal under 80C, (3) Investment horizon — SIP works better over 7+ years, (4) Risk appetite — loan prepayment is risk-free while SIP carries market risk, (5) Emergency fund — maintain 6 months' expenses before extra payments/investments.",
  },
  {
    question: "Can I do both — partial loan prepayment and SIP?",
    answer: "Yes, this is often the most balanced strategy. You could use 50% of surplus funds to prepay the loan (reducing tenure and total interest) and invest the other 50% in SIP for wealth creation. This gives you the benefit of reduced debt burden while also building a growing investment corpus. Adjust the ratio based on your loan interest rate and financial goals.",
  },
];

const relatedTools = [
  { href: "/sip", title: "SIP Returns Calculator", desc: "Estimate SIP returns with step-up option" },
  { href: "/goal-sip", title: "Goal-based Top-up SIP", desc: "Calculate SIP for a specific financial goal" },
  { href: "/income-tax", title: "Income Tax Calculator", desc: "Check tax benefits on home loan interest" },
];

export default function LoanVsSIP() {
  const [loanAmount, setLoanAmount] = useState(3000000);
  const [loanRate, setLoanRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [sipReturn, setSipReturn] = useState(12);

  const safeTenure = Math.max(1, loanTenure);
  const r = loanRate / 100 / 12;
  const n = safeTenure * 12;
  const emi = r > 0 ? (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : loanAmount / n;
  const totalLoanPayment = emi * n;
  const totalInterest = totalLoanPayment - loanAmount;

  const sipR = sipReturn / 100 / 12;
  const sipFactor = sipR > 0 ? (((Math.pow(1 + sipR, n) - 1) / sipR) * (1 + sipR)) : n;
  const sipMonthly = sipFactor > 0 ? loanAmount / sipFactor : 0;
  const totalSipInvested = sipMonthly * n;
  const sipCorpus = sipMonthly * sipFactor;

  const investBetter = sipReturn > loanRate;

  const comparisonData = useMemo(() => [
    { name: "Loan Repayment", principal: loanAmount, extra: Math.round(totalInterest), label: "Interest" },
    { name: "SIP Investment", principal: Math.round(totalSipInvested), extra: Math.round(sipCorpus - totalSipInvested), label: "Returns" },
  ], [loanAmount, totalInterest, totalSipInvested, sipCorpus]);

  const copyText = `Loan vs SIP Comparison\nLoan: ${formatINR(loanAmount)} at ${loanRate}% for ${safeTenure} yrs\nEMI: ${formatINR(Math.round(emi))}/mo\nTotal Interest: ${formatINR(Math.round(totalInterest))}\nTotal Loan Outflow: ${formatINR(Math.round(totalLoanPayment))}\n\nSIP needed for same corpus: ${formatINR(Math.round(sipMonthly))}/mo at ${sipReturn}%\nTotal SIP Invested: ${formatINR(Math.round(totalSipInvested))}\nSIP Corpus: ${formatINR(Math.round(sipCorpus))}\n\nVerdict: ${investBetter ? "Investing in SIP is better" : "Prepaying the loan is better"}`;

  const jsonLd = useMemo(() => [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Loan vs SIP Comparison Calculator",
      url: "https://mypaisahq.com/loan-vs-sip",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      description: "Compare loan prepayment vs SIP investment. Calculate EMI, total interest, and SIP returns to make smarter financial decisions.",
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
        { "@type": "ListItem", position: 2, name: "Loan vs SIP Comparison", item: "https://mypaisahq.com/loan-vs-sip" },
      ],
    },
  ], []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <SEOHead
        title="Loan vs SIP Comparison Calculator - My Paisa HQ"
        description="Should you prepay your home loan or invest in SIP? Compare EMI payments, total interest outflow and SIP returns side by side. Calculate the optimal strategy for your financial situation."
        canonicalPath="/loan-vs-sip"
        jsonLd={jsonLd}
      />
      <Breadcrumb currentPage="Loan vs SIP Comparison" />
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Loan vs SIP Comparison</h1>
        <p className="text-muted-foreground">Should you prepay your loan or invest the surplus in SIP?</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Loan & SIP Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Loan Amount</Label>
              <Input
                type="number"
                min={0}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Math.max(0, Number(e.target.value)))}
                data-testid="input-loan-amount"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Loan Interest Rate (%)</Label>
                <Input
                  type="number"
                  min={0}
                  step={0.1}
                  value={loanRate}
                  onChange={(e) => setLoanRate(Math.max(0, Number(e.target.value)))}
                  data-testid="input-loan-rate"
                />
              </div>
              <div className="space-y-2">
                <Label>Loan Tenure (Years)</Label>
                <Input
                  type="number"
                  min={1}
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(Math.max(1, Math.floor(Number(e.target.value))))}
                  data-testid="input-loan-tenure"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Expected SIP Return (%)</Label>
              <Input
                type="number"
                min={0}
                step={0.1}
                value={sipReturn}
                onChange={(e) => setSipReturn(Math.max(0, Number(e.target.value)))}
                data-testid="input-sip-return"
              />
            </div>
          </CardContent>
        </Card>

        <ResultCard title="Comparison Results" copyText={copyText} id="loan-vs-sip">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-md bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Monthly EMI</p>
                <p className="text-lg font-bold" data-testid="text-emi">{formatINR(Math.round(emi))}</p>
              </div>
              <div className="p-3 rounded-md bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Monthly SIP Needed</p>
                <p className="text-lg font-bold text-primary" data-testid="text-sip-monthly">{formatINR(Math.round(sipMonthly))}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm py-1.5 border-b">
                <span>Total Loan Payment</span>
                <span className="font-medium">{formatINR(Math.round(totalLoanPayment))}</span>
              </div>
              <div className="flex justify-between text-sm py-1.5 border-b">
                <span>Total Interest Paid</span>
                <span className="font-medium text-destructive">{formatINR(Math.round(totalInterest))}</span>
              </div>
              <div className="flex justify-between text-sm py-1.5 border-b">
                <span>Total SIP Invested</span>
                <span className="font-medium">{formatINR(Math.round(totalSipInvested))}</span>
              </div>
              <div className="flex justify-between text-sm py-1.5">
                <span>SIP Corpus at Maturity</span>
                <span className="font-medium text-green-600 dark:text-green-400">{formatINR(Math.round(sipCorpus))}</span>
              </div>
            </div>

            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => formatINRCompact(v)} tick={{ fontSize: 11 }} width={55} />
                  <Tooltip
                    formatter={(value: number, name: string) => [formatINR(value), name === "principal" ? "Principal" : "Interest/Returns"]}
                    contentStyle={{
                      borderRadius: "6px",
                      fontSize: "12px",
                      border: "1px solid hsl(var(--border))",
                      backgroundColor: "hsl(var(--background))",
                    }}
                  />
                  <Bar dataKey="principal" stackId="a" fill="hsl(var(--chart-2))" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="extra" stackId="a" radius={[4, 4, 0, 0]}>
                    <Cell fill="hsl(var(--destructive))" />
                    <Cell fill="hsl(var(--chart-3))" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className={`p-4 rounded-md text-center ${investBetter ? "bg-green-50 dark:bg-green-950/30" : "bg-primary/10"}`}>
              <p className="text-sm font-semibold" data-testid="text-verdict">
                {investBetter
                  ? "Investing in SIP is better than prepaying the loan"
                  : "Prepaying the loan is a better option"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {investBetter
                  ? `SIP return (${sipReturn}%) > Loan interest (${loanRate}%)`
                  : `Loan interest (${loanRate}%) >= SIP return (${sipReturn}%)`}
              </p>
            </div>
          </div>
        </ResultCard>
      </div>

      <RelatedTools tools={relatedTools} />
      <FAQSection faqs={faqs} />
    </div>
  );
}
