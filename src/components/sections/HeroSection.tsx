import { Button } from "@/components/ui/button";
import { Upload, FileText, Scan, Clock, AlertCircle } from "lucide-react";
import doctorFemale from "@/assets/doctor-female.jpg";
import doctorMale from "@/assets/doctor-male.jpg";

const trustIndicators = [
  { icon: Scan, text: "Privacy Protected" },
  { icon: Clock, text: "Results in Seconds" },
  { icon: AlertCircle, text: "Safety First" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-accent/30 via-background to-background">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      <div className="container relative py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Logo */}
            <div className="mb-8 flex justify-center lg:justify-start animate-fade-in">
              <img 
                src="/pharmalens-logo.svg" 
                alt="PharmaLens Logo" 
                className="h-16 w-auto"
              />
            </div>
            
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary animate-fade-in">
              <Scan className="h-4 w-4 animate-pulse-soft" />
              Trusted by patients and caregivers
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Understand your prescription.{" "}
              <span className="text-primary">Take your medicines safely.</span>
            </h1>

            {/* Subtext */}
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground animate-fade-in-up lg:mx-0 mx-auto" style={{ animationDelay: "0.2s" }}>
              Get clear, personalized guidance on your medications. Know when to take them, 
              what to avoid, and stay informed about potential interactions—all in plain language.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <Button variant="hero" size="xl" className="group">
                <Upload className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
                Upload Prescription
              </Button>
              <Button variant="heroOutline" size="xl" className="group">
                <FileText className="h-5 w-5 transition-transform group-hover:scale-110" />
                Enter Manually
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 lg:justify-start lg:gap-10 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              {trustIndicators.map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-all duration-300 hover:text-foreground"
                >
                  <item.icon className="h-5 w-5 text-primary" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Doctor Images */}
          <div className="relative hidden lg:block animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <div className="relative mx-auto max-w-md">
              {/* Main doctor image */}
              <div className="relative z-10 overflow-hidden rounded-2xl shadow-elevated transition-transform duration-500 hover:scale-[1.02]">
                <img 
                  src={doctorFemale} 
                  alt="Healthcare professional ready to help" 
                  className="w-full h-auto object-cover aspect-[4/5]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              </div>
              
              {/* Secondary doctor image - floating card */}
              <div className="absolute -bottom-6 -left-12 z-20 w-40 overflow-hidden rounded-xl border-4 border-background shadow-card animate-float">
                <img 
                  src={doctorMale} 
                  alt="Doctor consultation" 
                  className="w-full h-auto object-cover aspect-square"
                />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-primary/10 animate-pulse-soft" />
              <div className="absolute -bottom-8 right-12 h-16 w-16 rounded-full bg-success/10 animate-pulse-soft" style={{ animationDelay: "0.5s" }} />
            </div>
          </div>
        </div>

        {/* Process Steps */}
        <div className="mt-20 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <div className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-2 shadow-elevated">
            <div className="rounded-xl bg-muted/50 p-8 lg:p-12">
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  { title: "Upload", desc: "Take a photo or upload your prescription" },
                  { title: "Analyze", desc: "We extract and verify medication details" },
                  { title: "Guide", desc: "Receive clear, actionable guidance" },
                ].map((step, index) => (
                  <div 
                    key={step.title} 
                    className="flex items-start gap-4 transition-all duration-300 hover:translate-y-[-2px]"
                    style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground transition-transform duration-300 hover:scale-110">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground">{step.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}