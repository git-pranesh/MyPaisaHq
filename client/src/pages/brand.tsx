import { useEffect } from "react";

export default function Brand() {
  useEffect(() => { document.title = "Brand Assets - My Paisa HQ"; }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Brand Assets</h1>
        <p className="text-muted-foreground">Right-click any logo below and select "Save image as" to download as PNG</p>
      </div>

      <div className="space-y-12">
        <div>
          <h2 className="text-lg font-semibold mb-1">Icon Logo (512 x 512)</h2>
          <p className="text-sm text-muted-foreground mb-4">Use for favicon, app icon, social media profile picture</p>
          <div className="inline-block p-8 rounded-lg border bg-white">
            <img
              src="/logo-icon.svg"
              alt="My Paisa HQ Icon Logo"
              width={512}
              height={512}
              className="block"
              data-testid="img-logo-icon"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Also available at: <a href="/logo-icon.svg" className="text-primary underline" target="_blank" rel="noopener noreferrer">mypaisahq.com/logo-icon.svg</a>
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-1">Full Logo with Branding</h2>
          <p className="text-sm text-muted-foreground mb-4">Use for website header, social media banner, marketing materials</p>
          <div className="inline-block p-8 rounded-lg border bg-white">
            <img
              src="/logo-full.svg"
              alt="My Paisa HQ Full Logo"
              width={700}
              height={256}
              className="block"
              data-testid="img-logo-full"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Also available at: <a href="/logo-full.svg" className="text-primary underline" target="_blank" rel="noopener noreferrer">mypaisahq.com/logo-full.svg</a>
          </p>
        </div>

        <div className="p-4 rounded-md bg-muted/50 text-sm">
          <p className="font-medium mb-2">How to get PNG versions:</p>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
            <li>Right-click the logo above and select "Save image as"</li>
            <li>If your browser saves it as SVG, visit <a href="https://svgtopng.com" className="text-primary underline" target="_blank" rel="noopener noreferrer">svgtopng.com</a> to convert</li>
            <li>Or take a screenshot of the logo for a quick PNG</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
