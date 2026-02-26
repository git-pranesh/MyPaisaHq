import { useState, useEffect } from "react";
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
  useEffect(() => { document.title = "In-Hand Salary & CTC Calculator - My Paisa HQ"; }, []);
  const [ctc, setCTC] = useState(1200000);
  const [basicPercent, setBasicPercent] = useState(40);
  const [isMetro, setIsMetro] = useState(true);
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

  const taxNew = calcNewRegimeTax(taxableNew);
  const cessNew = taxNew * 0.04;
  const totalTaxNew = Math.round(taxNew + cessNew);

  const taxOld = calcOldRegimeTax(taxableOld);
  const cessOld = taxOld * 0.04;
  const totalTaxOld = Math.round(taxOld + cessOld);

  const inHandNewAnnual = grossAnnual - totalTaxNew - pfAnnual - professionalTax;
  const inHandNewMonthly = Math.round(inHandNewAnnual / 12);

  const inHandOldAnnual = grossAnnual - totalTaxOld - pfAnnual - professionalTax;
  const inHandOldMonthly = Math.round(inHandOldAnnual / 12);

  const copyText = `CTC Breakdown\nAnnual CTC: ${formatINR(ctc)}\nBasic: ${formatINR(basicAnnual)}/yr\nHRA: ${formatINR(hraAnnual)}/yr\nPF (Employee): ${formatINR(pfAnnual)}/yr\nNew Regime Tax: ${formatINR(totalTaxNew)}\nIn-Hand (New): ${formatINR(inHandNewMonthly)}/month\nOld Regime Tax: ${formatINR(totalTaxOld)}\nIn-Hand (Old): ${formatINR(inHandOldMonthly)}/month`;

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
                min={0}
                value={ctc}
                onChange={(e) => setCTC(Math.max(0, Number(e.target.value)))}
                data-testid="input-ctc"
              />
            </div>
            <div className="space-y-2">
              <Label>Basic Salary (% of CTC)</Label>
              <Input
                type="number"
                min={1}
                max={100}
                value={basicPercent}
                onChange={(e) => setBasicPercent(Math.max(1, Math.min(100, Number(e.target.value))))}
                data-testid="input-basic-percent"
              />
            </div>
            <div className="space-y-2">
              <Label>Professional Tax (Annual)</Label>
              <Input
                type="number"
                min={0}
                value={professionalTax}
                onChange={(e) => setProfessionalTax(Math.max(0, Number(e.target.value)))}
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
            <p className="text-xs text-muted-foreground">
              PF capped at statutory limit of ₹15,000/month basic (₹21,600/year max contribution)
            </p>
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
