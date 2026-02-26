import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import ResultCard from "@/components/result-card";
import { formatINR } from "@/lib/formatters";

export default function HRA() {
  const [basic, setBasic] = useState(40000);
  const [hraReceived, setHraReceived] = useState(20000);
  const [rentPaid, setRentPaid] = useState(15000);
  const [isMetro, setIsMetro] = useState(true);

  const actualHRA = hraReceived;
  const percentBasic = isMetro ? basic * 0.5 : basic * 0.4;
  const rentMinus10 = Math.max(0, rentPaid - basic * 0.1);

  const exemption = Math.min(actualHRA, percentBasic, rentMinus10);
  const taxableHRA = Math.max(0, hraReceived - exemption);

  const items = [
    { label: "Actual HRA received", value: actualHRA, isMin: exemption === actualHRA },
    { label: `${isMetro ? "50%" : "40%"} of Basic Salary`, value: percentBasic, isMin: exemption === percentBasic },
    { label: "Rent paid - 10% of Basic", value: rentMinus10, isMin: exemption === rentMinus10 },
  ];

  const copyText = `HRA Exemption\nBasic: ${formatINR(basic)}/mo\nHRA Received: ${formatINR(hraReceived)}/mo\nRent Paid: ${formatINR(rentPaid)}/mo\nHRA Exemption: ${formatINR(exemption)}/mo (${formatINR(exemption * 12)}/yr)\nTaxable HRA: ${formatINR(taxableHRA)}/mo`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">HRA Exemption Calculator</h1>
        <p className="text-muted-foreground">Calculate how much HRA exemption you can claim under Section 10(13A)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Input Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Basic Salary (Monthly)</Label>
              <Input
                type="number"
                min={0}
                value={basic}
                onChange={(e) => setBasic(Math.max(0, Number(e.target.value)))}
                data-testid="input-basic"
              />
            </div>
            <div className="space-y-2">
              <Label>Actual HRA Received (Monthly)</Label>
              <Input
                type="number"
                min={0}
                value={hraReceived}
                onChange={(e) => setHraReceived(Math.max(0, Number(e.target.value)))}
                data-testid="input-hra-received"
              />
            </div>
            <div className="space-y-2">
              <Label>Actual Rent Paid (Monthly)</Label>
              <Input
                type="number"
                min={0}
                value={rentPaid}
                onChange={(e) => setRentPaid(Math.max(0, Number(e.target.value)))}
                data-testid="input-rent"
              />
            </div>
            <div className="flex items-center justify-between gap-2 p-3 rounded-md bg-muted/50">
              <div>
                <Label>Metro City</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Delhi, Mumbai, Kolkata, Chennai</p>
              </div>
              <Switch checked={isMetro} onCheckedChange={setIsMetro} data-testid="switch-metro" />
            </div>
          </CardContent>
        </Card>

        <ResultCard title="HRA Exemption" copyText={copyText} id="hra">
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div
                key={item.label}
                className={`p-3 rounded-md flex items-center justify-between gap-2 ${
                  item.isMin ? "bg-primary/10 ring-2 ring-primary/30" : "bg-muted/50"
                }`}
              >
                <div>
                  <p className="text-sm">{item.label}</p>
                  {item.isMin && (
                    <span className="text-xs text-primary font-medium">Minimum (Exemption)</span>
                  )}
                </div>
                <span className={`text-sm font-semibold ${item.isMin ? "text-primary" : ""}`}>
                  {formatINR(Math.round(item.value))}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-md bg-primary/10 text-center">
              <p className="text-sm text-muted-foreground mb-1">Monthly HRA Exemption</p>
              <p className="text-2xl font-bold text-primary" data-testid="text-exemption">
                {formatINR(Math.round(exemption))}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Annual: {formatINR(Math.round(exemption * 12))}
              </p>
            </div>
            <div className="flex items-center justify-between gap-2 p-3 rounded-md border">
              <span className="text-sm">Taxable HRA</span>
              <span className="text-sm font-semibold text-destructive" data-testid="text-taxable-hra">
                {formatINR(Math.round(taxableHRA))}/mo
              </span>
            </div>
          </div>
        </ResultCard>
      </div>
    </div>
  );
}
