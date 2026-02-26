import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { copyToClipboard } from "@/lib/formatters";

interface ResultCardProps {
  title: string;
  children: React.ReactNode;
  copyText?: string;
  id?: string;
}

export default function ResultCard({ title, children, copyText, id }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!copyText) return;
    await copyToClipboard(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const testId = id ? `button-copy-${id}` : "button-copy-result";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3">
        <CardTitle className="text-base" data-testid={id ? `text-title-${id}` : undefined}>{title}</CardTitle>
        {copyText && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            data-testid={testId}
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          </Button>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
