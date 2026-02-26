import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import ResultCard from "@/components/result-card";
import { formatINR, formatINRCompact } from "@/lib/formatters";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function SIP() {
  const [monthlyInv, setMonthlyInv] = useState(10000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [duration, setDuration] = useState(10);
  const [stepUpEnabled, setStepUpEnabled] = useState(false);
  const [stepUpPercent, setStepUpPercent] = useState(10);

  const chartData = useMemo(() => {
    const data: { year: number; invested: number; value: number }[] = [];
    const r = annualReturn / 100 / 12;
    let totalInvested = 0;
    let totalValue = 0;

    for (let year = 1; year <= duration; year++) {
      const sipAmount = stepUpEnabled
        ? monthlyInv * Math.pow(1 + stepUpPercent / 100, year - 1)
        : monthlyInv;

      for (let month = 1; month <= 12; month++) {
        totalInvested += sipAmount;
        totalValue = (totalValue + sipAmount) * (1 + r);
      }

      data.push({
        year,
        invested: Math.round(totalInvested),
        value: Math.round(totalValue),
      });
    }
    return data;
  }, [monthlyInv, annualReturn, duration, stepUpEnabled, stepUpPercent]);

  const finalData = chartData[chartData.length - 1] || { invested: 0, value: 0 };
  const totalInvested = finalData.invested;
  const maturityValue = finalData.value;
  const estimatedReturns = maturityValue - totalInvested;

  const copyText = `SIP Returns\nMonthly Investment: ${formatINR(monthlyInv)}\nExpected Return: ${annualReturn}%\nDuration: ${duration} years${stepUpEnabled ? `\nStep-up: ${stepUpPercent}%/yr` : ""}\nTotal Invested: ${formatINR(totalInvested)}\nEstimated Returns: ${formatINR(estimatedReturns)}\nMaturity Value: ${formatINR(maturityValue)}`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">SIP Returns Calculator</h1>
        <p className="text-muted-foreground">Estimate returns from your systematic investment plan with step-up option</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Investment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Monthly Investment</Label>
              <Input
                type="number"
                value={monthlyInv || ""}
                onChange={(e) => setMonthlyInv(Number(e.target.value))}
                data-testid="input-monthly-inv"
              />
            </div>
            <div className="space-y-2">
              <Label>Expected Annual Return (%)</Label>
              <Input
                type="number"
                value={annualReturn || ""}
                onChange={(e) => setAnnualReturn(Number(e.target.value))}
                data-testid="input-annual-return"
              />
            </div>
            <div className="space-y-2">
              <Label>Investment Duration (Years)</Label>
              <Input
                type="number"
                min={1}
                max={40}
                value={duration || ""}
                onChange={(e) => setDuration(Number(e.target.value))}
                data-testid="input-duration"
              />
            </div>
            <div className="flex items-center justify-between gap-2 p-3 rounded-md bg-muted/50">
              <div>
                <Label>Step-up SIP</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Increase SIP annually</p>
              </div>
              <Switch checked={stepUpEnabled} onCheckedChange={setStepUpEnabled} data-testid="switch-stepup" />
            </div>
            {stepUpEnabled && (
              <div className="space-y-2">
                <Label>Annual Step-up (%)</Label>
                <Input
                  type="number"
                  value={stepUpPercent || ""}
                  onChange={(e) => setStepUpPercent(Number(e.target.value))}
                  data-testid="input-stepup-percent"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <ResultCard title="SIP Returns" copyText={copyText} id="sip">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-md bg-muted/50">
                <p className="text-xs text-muted-foreground">Invested</p>
                <p className="text-sm font-bold mt-1" data-testid="text-total-invested">
                  {formatINRCompact(totalInvested)}
                </p>
              </div>
              <div className="text-center p-3 rounded-md bg-muted/50">
                <p className="text-xs text-muted-foreground">Returns</p>
                <p className="text-sm font-bold text-green-600 dark:text-green-400 mt-1" data-testid="text-returns">
                  {formatINRCompact(estimatedReturns)}
                </p>
              </div>
              <div className="text-center p-3 rounded-md bg-primary/10">
                <p className="text-xs text-muted-foreground">Maturity</p>
                <p className="text-sm font-bold text-primary mt-1" data-testid="text-maturity">
                  {formatINRCompact(maturityValue)}
                </p>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `Y${v}`}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => formatINRCompact(v)}
                    width={60}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      formatINR(value),
                      name === "invested" ? "Invested" : "Value",
                    ]}
                    labelFormatter={(label) => `Year ${label}`}
                    contentStyle={{
                      borderRadius: "6px",
                      fontSize: "12px",
                      border: "1px solid hsl(var(--border))",
                      backgroundColor: "hsl(var(--background))",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="invested"
                    stackId="1"
                    stroke="hsl(var(--chart-2))"
                    fill="hsl(var(--chart-2))"
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stackId="2"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center gap-4 justify-center text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "hsl(var(--chart-2))" }} />
                <span>Invested</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "hsl(var(--primary))" }} />
                <span>Total Value</span>
              </div>
            </div>
          </div>
        </ResultCard>
      </div>
    </div>
  );
}
