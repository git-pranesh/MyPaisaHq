import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/8th-pay-commission", label: "8th Pay Commission" },
  { href: "/gratuity", label: "Gratuity" },
  { href: "/salary", label: "Salary/CTC" },
  { href: "/hra", label: "HRA" },
  { href: "/hike", label: "Salary Hike" },
  { href: "/income-tax", label: "Income Tax" },
  { href: "/sip", label: "SIP" },
  { href: "/loan-vs-sip", label: "Loan vs SIP" },
  { href: "/goal-sip", label: "Goal SIP" },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  return (
    <nav className="sticky top-0 z-[9999] bg-background/95 backdrop-blur border-b" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between gap-2 h-14">
          <Link href="/" className="flex items-center gap-2 shrink-0" data-testid="link-home">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">My Paisa HQ</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1 flex-wrap">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={location === link.href ? "default" : "ghost"}
                  size="sm"
                  data-testid={`link-nav-${link.href.slice(1)}`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            <a href="https://mypaisahq.com/blog" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm" data-testid="link-nav-knowledge-hub">
                Knowledge Hub
              </Button>
            </a>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setOpen(!open)}
            data-testid="button-mobile-menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t bg-background">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                <Button
                  variant={location === link.href ? "default" : "ghost"}
                  className="w-full justify-start"
                  data-testid={`link-mobile-${link.href.slice(1)}`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            <a href="https://mypaisahq.com/blog" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full justify-start" data-testid="link-mobile-knowledge-hub">
                Knowledge Hub
              </Button>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-16" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2" data-testid="link-footer-home">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <IndianRupee className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">My Paisa HQ</span>
          </Link>
          <a href="https://mypaisahq.com/blog" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline" data-testid="link-footer-knowledge-hub">
            Knowledge Hub
          </a>
          <p className="text-xs text-muted-foreground text-center max-w-xl" data-testid="text-disclaimer">
            Disclaimer: The calculators provided are for informational purposes only. Results are approximate
            and should not be considered as financial advice. Please consult a qualified financial advisor for
            personalized guidance. Tax laws and rates are subject to change.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
