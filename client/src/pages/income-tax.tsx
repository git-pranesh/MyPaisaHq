import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ResultCard from "@/components/result-card";
import { formatINR } from "@/lib/formatters";

function calcNewRegime(income: number): { slabs: { range: string; rate: string; tax: number }[]; total: number; rebate: number } {
  const slabDefs = [
    { from: 0, to: 400000, rate: 0 },
    { from: 400000, to: 800000, rate: 0.05 },
    { from: 800000, to: 1200000, rate: 0.10 },
    { from: 1200000, to: 1600000, rate: 0.15 },
    { from: 1600000, to: 2000000, rate: 0.20 },
    { from: 2000000, to: 2400000, rate: 0.25 },
    { from: 2400000, to: Infinity, rate: 0.30 },
  ];
  const slabs: { range: string; rate: string; tax: number }[] = [];
  let total = 0;
  for (const s of slabDefs) {
    if (income <= s.from) {
      slabs.push({ range: formatSlabRange(s.from, s.to), rate: `${s.rate * 100}%`, tax: 0 });
      continue;
    }
    const taxable = Math.min(income, s.to) - s.from;
    const tax = Math.max(0, taxable) * s.rate;
    total += tax;
    slabs.push({ range: formatSlabRange(s.from, s.to), rate: `${s.rate * 100}%`, tax: Math.round(tax) });
  }
  const rebate = income <= 1200000 ? total : 0;
  return { slabs, total: Math.round(total), rebate: Math.round(rebate) };
}

function calcOldRegime(income: number, age: string): { slabs: { range: string; rate: string; tax: number }[]; total: number; rebate: number } {
  let slabDefs: { from: number; to: number; rate: number }[];
  if (age === "above80") {
    slabDefs = [
      { from: 0, to: 500000, rate: 0 },
      { from: 500000, to: 1000000, rate: 0.20 },
      { from: 1000000, to: Infinity, rate: 0.30 },
    ];
  } else if (age === "60-80") {
    slabDefs = [
      { from: 0, to: 300000, rate: 0 },
      { from: 300000, to: 500000, rate: 0.05 },
      { from: 500000, to: 1000000, rate: 0.20 },
      { from: 1000000, to: Infinity, rate: 0.30 },
    ];
  } else {
    slabDefs = [
      { from: 0, to: 250000, rate: 0 },
      { from: 250000, to: 500000, rate: 0.05 },
      { from: 500000, to: 1000000, rate: 0.20 },
      { from: 1000000, to: Infinity, rate: 0.30 },
    ];
  }
  const slabs: { range: string; rate: string; tax: number }[] = [];
  let total = 0;
  for (const s of slabDefs) {
    if (income <= s.from) {
      slabs.push({ range: formatSlabRange(s.from, s.to), rate: `${s.rate * 100}%`, tax: 0 });
      continue;
    }
    const taxable = Math.min(income, s.to) - s.from;
    const tax = Math.max(0, taxable) * s.rate;
    total += tax;
    slabs.push({ range: formatSlabRange(s.from, s.to), rate: `${s.rate * 100}%`, tax: Math.round(tax) });
  }
  const rebate = income <= 500000 ? total : 0;
  return { slabs, total: Math.round(total), rebate: Math.round(rebate) };
}

function formatSlabRange(from: number, to: number): string {
  if (to === Infinity) return `Above ${formatINR(from)}`;
  return `${formatINR(from)} - ${formatINR(to)}`;
}

export default function IncomeTax() {
  const [income, setIncome] = useState(1500000);
  const [age, setAge] = useState("below60");
  const [deduction80C, setDeduction80C] = useState(150000);
  const [deduction80D, setDeduction80D] = useState(25000);
  const [hraExemption, setHraExemption] = useState(0);

  const stdDeductionNew = 75000;
  const stdDeductionOld = 50000;

  const taxableNew = Math.max(0, income - stdDeductionNew);
  const newResult = calcNewRegime(taxableNew);
  const newTaxAfterRebate = newResult.total - newResult.rebate;
  const newCess = Math.round(newTaxAfterRebate * 0.04);
  const newTotal = newTaxAfterRebate + newCess;

  const maxD80D = age === "below60" ? 25000 : 50000;
  const ded80C = Math.min(deduction80C, 150000);
  const ded80D = Math.min(deduction80D, maxD80D);
  const totalOldDeductions = stdDeductionOld + ded80C + ded80D + hraExemption;
  const taxableOld = Math.max(0, income - totalOldDeductions);
  const oldResult = calcOldRegime(taxableOld, age);
  const oldTaxAfterRebate = oldResult.total - oldResult.rebate;
  const oldCess = Math.round(oldTaxAfterRebate * 0.04);
  const oldTotal = oldTaxAfterRebate + oldCess;

  const savings = oldTotal - newTotal;

  const copyText = `Income Tax FY 2025-26\nIncome: ${formatINR(income)}\nNew Regime Tax: ${formatINR(newTotal)}\nOld Regime Tax: ${formatINR(oldTotal)}\nBetter: ${savings > 0 ? "New Regime" : "Old Regime"} by ${formatINR(Math.abs(savings))}`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Income Tax Calculator FY 2025-26</h1>
        <p className="text-muted-foreground">Compare old vs new regime with slab-wise breakup</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Income Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Annual Income</Label>
              <Input
                type="number"
                min={0}
                value={income}
                onChange={(e) => setIncome(Math.max(0, Number(e.target.value)))}
                data-testid="input-income"
              />
            </div>
            <div className="space-y-2">
              <Label>Age Group</Label>
              <Select value={age} onValueChange={setAge}>
                <SelectTrigger data-testid="select-age">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="below60">Below 60</SelectItem>
                  <SelectItem value="60-80">60 to 80 (Senior)</SelectItem>
                  <SelectItem value="above80">Above 80 (Super Senior)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-3">Old Regime Deductions</p>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Section 80C (max 1.5L)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={deduction80C}
                    onChange={(e) => setDeduction80C(Math.max(0, Number(e.target.value)))}
                    data-testid="input-80c"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Section 80D (max {age === "below60" ? "25K" : "50K"})</Label>
                  <Input
                    type="number"
                    min={0}
                    value={deduction80D}
                    onChange={(e) => setDeduction80D(Math.max(0, Number(e.target.value)))}
                    data-testid="input-80d"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">HRA Exemption</Label>
                  <Input
                    type="number"
                    min={0}
                    value={hraExemption}
                    onChange={(e) => setHraExemption(Math.max(0, Number(e.target.value)))}
                    data-testid="input-hra-exempt"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <ResultCard title="New Regime" copyText={copyText} id="tax-new">
          <div className="space-y-3">
            <div className="text-xs text-muted-foreground mb-2">
              Std Deduction: {formatINR(stdDeductionNew)} | Taxable: {formatINR(taxableNew)}
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-1.5 font-medium text-xs">Slab</th>
                  <th className="text-right py-1.5 font-medium text-xs">Rate</th>
                  <th className="text-right py-1.5 font-medium text-xs">Tax</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {newResult.slabs.map((s, i) => (
                  <tr key={i}>
                    <td className="py-1.5 text-xs">{s.range}</td>
                    <td className="text-right py-1.5 text-xs">{s.rate}</td>
                    <td className="text-right py-1.5 text-xs">{formatINR(s.tax)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t pt-2 space-y-1">
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>{formatINR(newResult.total)}</span>
              </div>
              {newResult.rebate > 0 && (
                <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                  <span>Rebate u/s 87A</span>
                  <span>-{formatINR(newResult.rebate)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Cess (4%)</span>
                <span>{formatINR(newCess)}</span>
              </div>
              <div className="flex justify-between font-semibold text-primary border-t pt-2">
                <span>Total Tax</span>
                <span data-testid="text-new-tax">{formatINR(newTotal)}</span>
              </div>
            </div>
          </div>
        </ResultCard>

        <ResultCard title="Old Regime" copyText={copyText} id="tax-old">
          <div className="space-y-3">
            <div className="text-xs text-muted-foreground mb-2">
              Deductions: {formatINR(totalOldDeductions)} | Taxable: {formatINR(taxableOld)}
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-1.5 font-medium text-xs">Slab</th>
                  <th className="text-right py-1.5 font-medium text-xs">Rate</th>
                  <th className="text-right py-1.5 font-medium text-xs">Tax</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {oldResult.slabs.map((s, i) => (
                  <tr key={i}>
                    <td className="py-1.5 text-xs">{s.range}</td>
                    <td className="text-right py-1.5 text-xs">{s.rate}</td>
                    <td className="text-right py-1.5 text-xs">{formatINR(s.tax)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t pt-2 space-y-1">
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>{formatINR(oldResult.total)}</span>
              </div>
              {oldResult.rebate > 0 && (
                <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                  <span>Rebate u/s 87A</span>
                  <span>-{formatINR(oldResult.rebate)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Cess (4%)</span>
                <span>{formatINR(oldCess)}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total Tax</span>
                <span data-testid="text-old-tax">{formatINR(oldTotal)}</span>
              </div>
            </div>
          </div>
        </ResultCard>
      </div>

      <div className="mt-6 p-4 rounded-md bg-primary/10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-sm">
              {savings > 0
                ? "New Regime saves you more!"
                : savings < 0
                ? "Old Regime saves you more!"
                : "Both regimes result in the same tax"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Based on the deductions entered above</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">You save</p>
            <p className="text-2xl font-bold text-primary" data-testid="text-savings">
              {formatINR(Math.abs(savings))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
