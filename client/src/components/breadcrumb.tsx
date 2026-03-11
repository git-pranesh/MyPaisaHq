import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  currentPage: string;
}

export default function Breadcrumb({ currentPage }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-4" aria-label="Breadcrumb" data-testid="breadcrumb">
      <Link href="/" className="hover:text-primary transition-colors">Home</Link>
      <ChevronRight className="w-3 h-3" />
      <span className="text-foreground font-medium">{currentPage}</span>
    </nav>
  );
}
