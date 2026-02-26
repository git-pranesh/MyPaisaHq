import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResultCard from "@/components/result-card";
import { formatINR } from "@/lib/formatters";

export default function Hike() {
  const [currentCTC, setCurrentCTC] = useState(1000000);
  const [hikePercent, setHikePercent] = useState(20);
  const [desiredCTC, setDesiredCTC] = useState(1500000);

  const newCTC = Math.round(currentCTC * (1 + hikePercent / 100));
  const yearlyIncrease = newCTC - currentCTC;
  const monthlyIncrease = Math.round(yearlyIncrease / 12);

  const requiredHike = currentCTC > 0 ? (((desiredCTC - currentCTC) / currentCTC) * 100) : 0;
  const reverseYearlyIncrease = desiredCTC - currentCTC;
  const reverseMonthlyIncrease = Math.round(reverseYearlyIncrease / 12);

  const hikeSteps = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

  const copyText = `Salary Hike\nCurrent CTC: ${formatINR(currentCTC)}\nHike: ${hikePercent}%\nNew CTC: ${formatINR(newCTC)}\nMonthly Increase: ${formatINR(monthlyIncrease)}\nYearly Increase: ${formatINR(yearlyIncrease)}`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Salary Hike Calculator</h1>
        <p className="text-muted-foreground">Calculate your new salary after a hike or find the hike needed for a target</p>
      </div>

      <Tabs defaultValue="forward">
        <TabsList className="mb-6">
          <TabsTrigger value="forward" data-testid="tab-forward-hike">Calculate New Salary</TabsTrigger>
          <TabsTrigger value="reverse" data-testid="tab-reverse-hike">Find Required Hike</TabsTrigger>
        </TabsList>

        <TabsContent value="forward">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Input Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label>Current CTC (Annual)</Label>
                  <Input
                    type="number"
                    value={currentCTC || ""}
                    onChange={(e) => setCurrentCTC(Number(e.target.value))}
                    data-testid="input-current-ctc"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hike Percentage (%)</Label>
                  <Input
                    type="number"
                    value={hikePercent || ""}
                    onChange={(e) => setHikePercent(Number(e.target.value))}
                    data-testid="input-hike-percent"
                  />
                </div>
              </CardContent>
            </Card>

            <ResultCard title="Hike Results" copyText={copyText} id="hike-forward">
              <div className="space-y-4">
                <div className="p-4 rounded-md bg-primary/10 text-center">
                  <p className="text-sm text-muted-foreground mb-1">New CTC</p>
                  <p className="text-3xl font-bold text-primary" data-testid="text-new-ctc">{formatINR(newCTC)}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-md bg-muted/50 text-center">
                    <p className="text-xs text-muted-foreground">Monthly Increase</p>
                    <p className="text-lg font-semibold" data-testid="text-monthly-increase">{formatINR(monthlyIncrease)}</p>
                  </div>
                  <div className="p-3 rounded-md bg-muted/50 text-center">
                    <p className="text-xs text-muted-foreground">Yearly Increase</p>
                    <p className="text-lg font-semibold" data-testid="text-yearly-increase">{formatINR(yearlyIncrease)}</p>
                  </div>
                </div>
              </div>
            </ResultCard>
          </div>
        </TabsContent>

        <TabsContent value="reverse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Input Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label>Current CTC (Annual)</Label>
                  <Input
                    type="number"
                    value={currentCTC || ""}
                    onChange={(e) => setCurrentCTC(Number(e.target.value))}
                    data-testid="input-current-ctc-reverse"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Desired CTC (Annual)</Label>
                  <Input
                    type="number"
                    value={desiredCTC || ""}
                    onChange={(e) => setDesiredCTC(Number(e.target.value))}
                    data-testid="input-desired-ctc"
                  />
                </div>
              </CardContent>
            </Card>

            <ResultCard title="Required Hike" copyText={`Required Hike: ${requiredHike.toFixed(1)}%`} id="hike-reverse">
              <div className="space-y-4">
                <div className="p-4 rounded-md bg-primary/10 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Required Hike</p>
                  <p className="text-3xl font-bold text-primary" data-testid="text-required-hike">
                    {requiredHike.toFixed(1)}%
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-md bg-muted/50 text-center">
                    <p className="text-xs text-muted-foreground">Monthly Increase</p>
                    <p className="text-lg font-semibold">{formatINR(reverseMonthlyIncrease)}</p>
                  </div>
                  <div className="p-3 rounded-md bg-muted/50 text-center">
                    <p className="text-xs text-muted-foreground">Yearly Increase</p>
                    <p className="text-lg font-semibold">{formatINR(reverseYearlyIncrease)}</p>
                  </div>
                </div>
              </div>
            </ResultCard>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hike Comparison Table</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Hike %</th>
                    <th className="text-right py-2 font-medium">New CTC</th>
                    <th className="text-right py-2 font-medium">Monthly Increase</th>
                    <th className="text-right py-2 font-medium">Yearly Increase</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {hikeSteps.map((h) => {
                    const nc = Math.round(currentCTC * (1 + h / 100));
                    const yi = nc - currentCTC;
                    const mi = Math.round(yi / 12);
                    return (
                      <tr key={h} className={h === hikePercent ? "bg-primary/5" : ""}>
                        <td className="py-2">{h}%</td>
                        <td className="text-right py-2">{formatINR(nc)}</td>
                        <td className="text-right py-2">{formatINR(mi)}</td>
                        <td className="text-right py-2">{formatINR(yi)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
