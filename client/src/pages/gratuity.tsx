import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import ResultCard from "@/components/result-card";
import { formatINR } from "@/lib/formatters";
import { AlertCircle } from "lucide-react";

export default function Gratuity() {
  const [basicDA, setBasicDA] = useState(50000);
  const [years, setYears] = useState(15);
  const [months, setMonths] = useState(0);
  const [covered, setCovered] = useState(true);

  const effectiveYears = months >= 7 ? years + 1 : years;
  const isEligible = effectiveYears >= 5;

  const gratuity = covered
    ? (effectiveYears * basicDA * 15) / 26
    : (effectiveYears * basicDA * 15) / 30;

  const roundedGratuity = Math.round(gratuity);
  const exemptionLimit = 2500000;
  const exemptAmount = Math.min(roundedGratuity, exemptionLimit);
  const taxableAmount = Math.max(0, roundedGratuity - exemptionLimit);

  const copyText = `Gratuity Calculation\nBasic + DA: ${formatINR(basicDA)}/month\nYears of Service: ${years} years ${months} months\nGratuity Act Covered: ${covered ? "Yes" : "No"}\nGratuity Amount: ${formatINR(roundedGratuity)}\nTax Exempt: ${formatINR(exemptAmount)}\nTaxable: ${formatINR(taxableAmount)}`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Gratuity Calculator</h1>
        <p className="text-muted-foreground">Calculate your gratuity amount, tax exemption and taxable portion</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Input Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Monthly Basic Salary + DA</Label>
              <Input
                type="number"
                min={0}
                value={basicDA}
                onChange={(e) => setBasicDA(Math.max(0, Number(e.target.value)))}
                data-testid="input-basic-da"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Years of Service</Label>
                <Input
                  type="number"
                  min={0}
                  value={years}
                  onChange={(e) => setYears(Math.max(0, Math.floor(Number(e.target.value))))}
                  data-testid="input-years"
                />
              </div>
              <div className="space-y-2">
                <Label>Months</Label>
                <Input
                  type="number"
                  min={0}
                  max={11}
                  value={months}
                  onChange={(e) => setMonths(Math.max(0, Math.min(11, Math.floor(Number(e.target.value)))))}
                  data-testid="input-months"
                />
              </div>
            </div>

            {!isEligible && (
              <div className="flex items-start gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-sm" data-testid="text-eligibility-warning">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <p>Under the Payment of Gratuity Act, an employee must complete at least <strong>5 years of continuous service</strong> to be eligible for gratuity. Your current service period is below this threshold.</p>
              </div>
            )}

            <div className="flex items-center justify-between gap-2 p-3 rounded-md bg-muted/50">
              <div>
                <Label>Gratuity Act Covered</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Applies to organizations with 10+ employees
                </p>
              </div>
              <Switch
                checked={covered}
                onCheckedChange={setCovered}
                data-testid="switch-covered"
              />
            </div>

            <div className="text-xs text-muted-foreground p-3 rounded-md border">
              <p className="font-medium mb-1">Formula:</p>
              <p>
                {covered
                  ? "G = N × B × 15/26 (Gratuity Act)"
                  : "G = N × B × 15/30 (Non-covered)"}
              </p>
              <p className="mt-1">Where N = years of service, B = last drawn basic + DA</p>
              <p className="mt-1">If months ≥ 7, years are rounded up</p>
            </div>
          </CardContent>
        </Card>

        <ResultCard title="Gratuity Results" copyText={copyText} id="gratuity">
          <div className="space-y-4">
            <div className="p-4 rounded-md bg-primary/10 text-center">
              <p className="text-sm text-muted-foreground mb-1">Total Gratuity</p>
              <p className="text-3xl font-bold text-primary" data-testid="text-gratuity-amount">
                {formatINR(roundedGratuity)}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 py-2 border-b">
                <span className="text-sm">Effective Service Period</span>
                <span className="text-sm font-medium" data-testid="text-effective-years">
                  {effectiveYears} years
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 py-2 border-b">
                <span className="text-sm">Exemption Limit (Sec 10(10))</span>
                <span className="text-sm font-medium">{formatINR(exemptionLimit)}</span>
              </div>
              <div className="flex items-center justify-between gap-2 py-2 border-b">
                <span className="text-sm">Tax-Exempt Amount</span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400" data-testid="text-exempt">
                  {formatINR(exemptAmount)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 py-2">
                <span className="text-sm">Taxable Amount</span>
                <span className="text-sm font-medium text-destructive" data-testid="text-taxable">
                  {formatINR(taxableAmount)}
                </span>
              </div>
            </div>
          </div>
        </ResultCard>
      </div>
    </div>
  );
}
