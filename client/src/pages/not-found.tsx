import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-20">
      <div className="text-center max-w-md">
        <p className="text-7xl font-bold text-primary mb-4" data-testid="text-404">404</p>
        <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or may have been moved. Head back to the homepage to explore our finance calculators.
        </p>
        <Link href="/">
          <Button size="lg" data-testid="link-go-home">
            <Home className="w-4 h-4 mr-2" />
            Back to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
