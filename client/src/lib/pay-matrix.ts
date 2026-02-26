export interface PayLevel {
  level: string;
  entryPay: number;
  maxPay: number;
}

export const payLevels: PayLevel[] = [
  { level: "1", entryPay: 18000, maxPay: 56800 },
  { level: "2", entryPay: 19900, maxPay: 62800 },
  { level: "3", entryPay: 21700, maxPay: 68600 },
  { level: "4", entryPay: 25500, maxPay: 81100 },
  { level: "5", entryPay: 29200, maxPay: 92300 },
  { level: "6", entryPay: 35400, maxPay: 112500 },
  { level: "7", entryPay: 44900, maxPay: 142600 },
  { level: "8", entryPay: 47600, maxPay: 151100 },
  { level: "9", entryPay: 53100, maxPay: 167800 },
  { level: "10", entryPay: 56100, maxPay: 177500 },
  { level: "11", entryPay: 67700, maxPay: 210500 },
  { level: "12", entryPay: 78800, maxPay: 250000 },
  { level: "13", entryPay: 123100, maxPay: 390200 },
  { level: "13A", entryPay: 131100, maxPay: 414900 },
  { level: "14", entryPay: 144200, maxPay: 456500 },
  { level: "15", entryPay: 182200, maxPay: 577000 },
  { level: "16", entryPay: 205400, maxPay: 650300 },
  { level: "17", entryPay: 225000, maxPay: 712700 },
  { level: "18", entryPay: 250000, maxPay: 792000 },
];

export function getPayValuesForLevel(level: string): number[] {
  const found = payLevels.find((l) => l.level === level);
  if (!found) return [];
  const values: number[] = [];
  let current = found.entryPay;
  while (current <= found.maxPay) {
    values.push(current);
    current = Math.round(current * 1.03);
  }
  if (!values.includes(found.maxPay)) values.push(found.maxPay);
  return values;
}
