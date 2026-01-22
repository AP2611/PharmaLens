import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Scan, 
  Menu, 
  X, 
  Home, 
  Upload, 
  BookOpen, 
  AlertTriangle, 
  Lightbulb, 
  User 
} from "lucide-react";

const navItems = [
  { label: "Home", icon: Home, href: "#" },
  { label: "Upload Prescription", icon: Upload, href: "#upload" },
  { label: "Medicine Guide", icon: BookOpen, href: "#guide" },
  { label: "Safety Alerts", icon: AlertTriangle, href: "#safety" },
  { label: "Tips", icon: Lightbulb, href: "#tips" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 transition-all duration-300 hover:opacity-80 hover:scale-[1.02]">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary animate-pulse-soft">
            <Scan className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-semibold text-foreground">
            PharmaLens
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground hover:translate-y-[-1px]"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden items-center gap-3 lg:flex">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
          <Button size="sm">
            <User className="h-4 w-4" />
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border/50 bg-background lg:hidden animate-fade-in">
          <nav className="container flex flex-col gap-1 py-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </a>
            ))}
            <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
              <Button variant="outline" className="w-full">Sign In</Button>
              <Button className="w-full">Get Started</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
