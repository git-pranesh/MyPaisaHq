import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResultCard from "@/components/result-card";
import { formatINR } from "@/lib/formatters";

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
  let tax = 0;
  let prev = 0;
  for (const slab of slabs) {
    if (taxableIncome <= prev) break;
    const slabIncome = Math.min(taxableIncome, slab.limit) - prev;
    tax += slabIncome * slab.rate;
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
  let tax = 0;
  let prev = 0;
  for (const slab of slabs) {
    if (taxableIncome <= prev) break;
    const slabIncome = Math.min(taxableIncome, slab.limit) - prev;
    tax += slabIncome * slab.rate;
    prev = slab.limit;
  }
  if (taxableIncome <= 500000) tax = 0;
  return tax;
}

export default function Salary() {
  const [ctc, setCTC] = useState(1200000);
  const [basicPercent, setBasicPercent] = useState(40);
  const [isMetro, setIsMetro] = useState(true);
  const [pfEnabled, setPfEnabled] = useState(true);
  const [professionalTax, setProfessionalTax] = useState(2400);

  const basicAnnual = (ctc * basicPercent) / 100;
  const basicMonthly = basicAnnual / 12;

  const hraPercent = isMetro ? 50 : 40;
  const hraAnnual = (basicAnnual * hraPercent) / 100;

  const pfAnnual = pfEnabled ? Math.min(basicAnnual * 0.12, 21600 * 12) : 0;
  const employerPF = pfEnabled ? Math.min(basicAnnual * 0.12, 21600 * 12) : 0;

  const grossAnnual = ctc - employerPF;

  const stdDeductionNew = 75000;
  const stdDeductionOld = 50000;

  const taxableNew = Math.max(0, grossAnnual - stdDeductionNew - pfAnnual);
  const section80C = pfEnabled ? Math.min(pfAnnual, 150000) : 0;
  const taxableOld = Math.max(0, grossAnnual - stdDeductionOld - hraAnnual * 0.5 - section80C);

  const taxNew = calcNewRegimeTax(taxableNew);
  const cessNew = taxNew * 0.04;
  const totalTaxNew = Math.round(taxNew + cessNew);

  const taxOld = calcOldRegimeTax(taxableOld);
  const cessOld = taxOld * 0.04;
  const totalTaxOld = Math.round(taxOld + cessOld);

  const inHandNewMonthly = Math.round((grossAnnual - totalTaxNew - pfAnnual - professionalTax) / 12);
  const inHandOldMonthly = Math.round((grossAnnual - totalTaxOld - pfAnnual - professionalTax) / 12);

  const copyText = `CTC Breakdown\nAnnual CTC: ${formatINR(ctc)}\nBasic: ${formatINR(basicAnnual)}/yr\nHRA: ${formatINR(hraAnnual)}/yr\nPF (Employee): ${formatINR(pfAnnual)}/yr\nNew Regime Tax: ${formatINR(totalTaxNew)}\nIn-Hand (New): ${formatINR(inHandNewMonthly)}/month\nOld Regime Tax: ${formatINR(totalTaxOld)}\nIn-Hand (Old): ${formatINR(inHandOldMonthly)}/month`;

  const Row = ({ label, annual, monthly, highlight }: { label: string; annual: number; monthly: number; highlight?: boolean }) => (
    <tr className={highlight ? "font-semibold border-t-2" : ""}>
      <td className="py-2 text-sm">{label}</td>
      <td className="text-right py-2 text-sm">{formatINR(Math.round(monthly))}</td>
      <td className="text-right py-2 text-sm">{formatINR(Math.round(annual))}</td>
    </tr>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">In-Hand Salary / CTC Calculator</h1>
        <p className="text-muted-foreground">Break down your CTC into monthly in-hand salary for FY 2025-26</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Input Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Annual CTC</Label>
              <Input
                type="number"
                value={ctc || ""}
                onChange={(e) => setCTC(Number(e.target.value))}
                data-testid="input-ctc"
              />
            </div>
            <div className="space-y-2">
              <Label>Basic Salary (% of CTC)</Label>
              <Input
                type="number"
                min={1}
                max={100}
                value={basicPercent || ""}
                onChange={(e) => setBasicPercent(Number(e.target.value))}
                data-testid="input-basic-percent"
              />
            </div>
            <div className="space-y-2">
              <Label>Professional Tax (Annual)</Label>
              <Input
                type="number"
                value={professionalTax || ""}
                onChange={(e) => setProfessionalTax(Number(e.target.value))}
                data-testid="input-prof-tax"
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <Label>Metro City (HRA 50%)</Label>
              <Switch checked={isMetro} onCheckedChange={setIsMetro} data-testid="switch-metro" />
            </div>
            <div className="flex items-center justify-between gap-2">
              <Label>PF Contribution (12%)</Label>
              <Switch checked={pfEnabled} onCheckedChange={setPfEnabled} data-testid="switch-pf" />
            </div>
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
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Component</th>
                      <th className="text-right py-2 font-medium">Monthly</th>
                      <th className="text-right py-2 font-medium">Annual</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <Row label="Basic Salary" annual={basicAnnual} monthly={basicMonthly} />
                    <Row label="HRA" annual={hraAnnual} monthly={hraAnnual / 12} />
                    <Row label="Other Allowances" annual={grossAnnual - basicAnnual - hraAnnual} monthly={(grossAnnual - basicAnnual - hraAnnual) / 12} />
                    <Row label="(-) PF Deduction" annual={pfAnnual} monthly={pfAnnual / 12} />
                    <Row label="(-) Professional Tax" annual={professionalTax} monthly={professionalTax / 12} />
                    <Row label="(-) Std Deduction" annual={stdDeductionNew} monthly={stdDeductionNew / 12} />
                    <Row label="(-) Income Tax + Cess" annual={totalTaxNew} monthly={totalTaxNew / 12} />
                    <Row label="In-Hand Salary" annual={inHandNewMonthly * 12} monthly={inHandNewMonthly} highlight />
                  </tbody>
                </table>
              </ResultCard>
            </TabsContent>
            <TabsContent value="old">
              <ResultCard title="Old Regime Breakdown" copyText={copyText} id="salary-old">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Component</th>
                      <th className="text-right py-2 font-medium">Monthly</th>
                      <th className="text-right py-2 font-medium">Annual</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <Row label="Basic Salary" annual={basicAnnual} monthly={basicMonthly} />
                    <Row label="HRA" annual={hraAnnual} monthly={hraAnnual / 12} />
                    <Row label="Other Allowances" annual={grossAnnual - basicAnnual - hraAnnual} monthly={(grossAnnual - basicAnnual - hraAnnual) / 12} />
                    <Row label="(-) PF Deduction" annual={pfAnnual} monthly={pfAnnual / 12} />
                    <Row label="(-) Professional Tax" annual={professionalTax} monthly={professionalTax / 12} />
                    <Row label="(-) Std Deduction" annual={stdDeductionOld} monthly={stdDeductionOld / 12} />
                    <Row label="(-) 80C (PF)" annual={section80C} monthly={section80C / 12} />
                    <Row label="(-) Income Tax + Cess" annual={totalTaxOld} monthly={totalTaxOld / 12} />
                    <Row label="In-Hand Salary" annual={inHandOldMonthly * 12} monthly={inHandOldMonthly} highlight />
                  </tbody>
                </table>
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
              {inHandNewMonthly >= inHandOldMonthly
                ? "New regime saves you more!"
                : "Old regime saves you more!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
