export function formatINR(amount: number): string {
  if (isNaN(amount) || !isFinite(amount)) return "₹0";
  const isNegative = amount < 0;
  const abs = Math.abs(Math.round(amount));
  const str = abs.toString();
  if (str.length <= 3) return (isNegative ? "-" : "") + "₹" + str;
  let last3 = str.substring(str.length - 3);
  let remaining = str.substring(0, str.length - 3);
  let result = "";
  while (remaining.length > 2) {
    result = "," + remaining.substring(remaining.length - 2) + result;
    remaining = remaining.substring(0, remaining.length - 2);
  }
  result = remaining + result + "," + last3;
  return (isNegative ? "-" : "") + "₹" + result;
}

export function formatINRCompact(amount: number): string {
  if (isNaN(amount) || !isFinite(amount)) return "₹0";
  const abs = Math.abs(amount);
  if (abs >= 1e7) return "₹" + (amount / 1e7).toFixed(2) + " Cr";
  if (abs >= 1e5) return "₹" + (amount / 1e5).toFixed(2) + " L";
  if (abs >= 1e3) return "₹" + (amount / 1e3).toFixed(1) + " K";
  return formatINR(amount);
}

export function formatNumber(n: number): string {
  if (isNaN(n) || !isFinite(n)) return "0";
  return n.toLocaleString("en-IN");
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
