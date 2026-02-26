import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ResultCard from "@/components/result-card";
import { formatINR, formatINRCompact } from "@/lib/formatters";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

export default function LoanVsSIP() {
  useEffect(() => { document.title = "Loan vs SIP Comparison - My Paisa HQ"; }, []);
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
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
    </div>
  );
}
