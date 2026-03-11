import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function Brand() {
  useEffect(() => { document.title = "Brand Assets - My Paisa HQ"; }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Brand Assets</h1>
        <p className="text-muted-foreground">Download logo files for use in marketing, social media, and more</p>
      </div>

      <div className="space-y-12">
        <div>
          <h2 className="text-lg font-semibold mb-1">Icon Logo (512 x 512)</h2>
          <p className="text-sm text-muted-foreground mb-4">Use for favicon, app icon, social media profile picture</p>
          <div className="inline-block p-8 rounded-lg border bg-white">
            <img
              src="/logo-icon.svg"
              alt="My Paisa HQ Icon Logo"
              width={256}
              height={256}
              className="block"
              data-testid="img-logo-icon"
            />
          </div>
          <div className="mt-3">
            <a href="/logo-icon.svg" download="my-paisa-hq-icon.svg">
              <Button variant="outline" size="sm" data-testid="button-download-icon">
                <Download className="w-4 h-4 mr-2" />
                Download Icon SVG
              </Button>
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-1">Full Logo with Branding</h2>
          <p className="text-sm text-muted-foreground mb-4">Use for website header, social media banner, marketing materials</p>
          <div className="inline-block p-8 rounded-lg border bg-white">
            <img
              src="/logo-full.svg"
              alt="My Paisa HQ Full Logo"
              width={700}
              height={163}
              className="block"
              data-testid="img-logo-full"
            />
          </div>
          <div className="mt-3">
            <a href="/logo-full.svg" download="my-paisa-hq-full.svg">
              <Button variant="outline" size="sm" data-testid="button-download-full">
                <Download className="w-4 h-4 mr-2" />
                Download Full Logo SVG
              </Button>
            </a>
          </div>
        </div>

        <div className="p-4 rounded-md bg-muted/50 text-sm">
          <p className="font-medium mb-2">Need PNG versions?</p>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
            <li>Download the SVG file using the buttons above</li>
            <li>Visit <a href="https://svgtopng.com" className="text-primary underline" target="_blank" rel="noopener noreferrer">svgtopng.com</a> to convert to PNG at any resolution</li>
            <li>Or open the SVG in any image editor (Canva, Figma, etc.) and export as PNG</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
