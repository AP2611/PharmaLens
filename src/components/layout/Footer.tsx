import { Scan, Heart, Lock, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12">
        {/* Main Footer Content */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4 animate-fade-in">
            <a href="#" className="flex items-center gap-2.5 transition-all duration-300 hover:opacity-80">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Scan className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-semibold text-foreground">
                PharmaLens
              </span>
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Helping patients understand their prescriptions and take medicines safely.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2.5">
              {["Home", "Upload Prescription", "Medicine Guide", "Safety Tips"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-foreground">Support</h4>
            <ul className="space-y-2.5">
              {["Help Center", "Contact Us", "FAQs", "Accessibility"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-foreground">Contact</h4>
            <a
              href="mailto:support@pharmalens.com"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-200"
            >
              <Mail className="h-4 w-4" />
              support@pharmalens.com
            </a>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4 text-success animate-pulse-soft" />
              Your data is encrypted and secure
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 rounded-xl bg-accent/50 p-5 border border-border/50 animate-fade-in">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Important:</strong> PharmaLens provides medication information for educational purposes only. 
            It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult your 
            doctor or pharmacist before making any changes to your medication regimen.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2026 PharmaLens. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cookie Policy
            </a>
          </div>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            Made with <Heart className="h-4 w-4 text-destructive" /> for patient safety
          </p>
        </div>
      </div>
    </footer>
  );
}
