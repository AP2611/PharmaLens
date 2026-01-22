import { 
  Clock, 
  AlertTriangle, 
  Pill, 
  Apple, 
  Lightbulb, 
  CheckCircle2,
  AlertCircle,
  Droplets,
  Moon,
  Coffee
} from "lucide-react";
import { Button } from "@/components/ui/button";

const sampleMedications = [
  {
    name: "Metformin 500mg",
    schedule: "Twice daily with meals",
    times: ["8:00 AM", "6:00 PM"],
  },
  {
    name: "Lisinopril 10mg",
    schedule: "Once daily in the morning",
    times: ["8:00 AM"],
  },
  {
    name: "Vitamin D3 1000IU",
    schedule: "Once daily with food",
    times: ["12:00 PM"],
  },
];

const safetyWarnings = [
  {
    level: "warning",
    title: "Avoid taking Metformin and Lisinopril at the same time",
    description: "Take them at least 2 hours apart to ensure optimal absorption.",
  },
  {
    level: "info",
    title: "Monitor blood sugar levels regularly",
    description: "Metformin affects blood sugar. Check levels as advised by your doctor.",
  },
];

const sideEffects = [
  { medication: "Metformin", effects: ["Mild nausea", "Stomach discomfort"], severity: "common" },
  { medication: "Lisinopril", effects: ["Dry cough", "Dizziness"], severity: "common" },
];

const foodGuidance = [
  { icon: Coffee, text: "Limit caffeine intake while on Lisinopril", type: "avoid" },
  { icon: Apple, text: "Take Metformin with food to reduce stomach upset", type: "recommended" },
  { icon: Droplets, text: "Stay well hydrated throughout the day", type: "recommended" },
];

const tips = [
  { icon: Clock, text: "Set daily reminders for each medication time" },
  { icon: Moon, text: "Take Lisinopril at the same time each morning" },
  { icon: Pill, text: "Store medications in a cool, dry place away from sunlight" },
];

export function MedicationDashboard() {
  return (
    <section id="guide" className="py-20 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center animate-fade-in">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-success/10 px-4 py-1.5 text-sm font-medium text-success animate-pulse-soft">
            <CheckCircle2 className="h-4 w-4" />
            Analysis Complete
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Your Medication Guide
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Here's everything you need to know about your prescribed medications.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Medication Schedule */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft animate-slide-up transition-all duration-300 hover:shadow-card hover:translate-y-[-2px]" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 transition-transform duration-300 hover:scale-110">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">
                  Medication Schedule
                </h3>
              </div>
              
              <div className="space-y-4">
                {sampleMedications.map((med, index) => (
                  <div
                    key={med.name}
                    className="rounded-xl border border-border bg-background p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-soft"
                    style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">{med.name}</h4>
                        <p className="mt-1 text-sm text-muted-foreground">{med.schedule}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {med.times.map((time) => (
                          <span
                            key={time}
                            className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-all duration-200 hover:bg-primary/20"
                          >
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Warnings */}
            <div id="safety" className="rounded-2xl border border-border bg-card p-6 shadow-soft animate-slide-up transition-all duration-300 hover:shadow-card hover:translate-y-[-2px]" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10 transition-transform duration-300 hover:scale-110">
                  <AlertTriangle className="h-5 w-5 text-warning animate-pulse-soft" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">
                  Safety Warnings
                </h3>
              </div>
              
              <div className="space-y-4">
                {safetyWarnings.map((warning, index) => (
                  <div
                    key={index}
                    className={`rounded-xl border p-4 transition-all duration-300 hover:translate-x-1 ${
                      warning.level === "warning"
                        ? "border-warning/30 bg-warning/5 hover:border-warning/50"
                        : "border-info/30 bg-info/5 hover:border-info/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle
                        className={`mt-0.5 h-5 w-5 shrink-0 ${
                          warning.level === "warning" ? "text-warning" : "text-info"
                        }`}
                      />
                      <div>
                        <h4 className="font-medium text-foreground">{warning.title}</h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {warning.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Side Effects */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft animate-slide-up transition-all duration-300 hover:shadow-card hover:translate-y-[-2px]" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent transition-transform duration-300 hover:scale-110">
                  <Pill className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">
                  Possible Side Effects
                </h3>
              </div>
              
              <div className="space-y-4">
                {sideEffects.map((item) => (
                  <div
                    key={item.medication}
                    className="rounded-xl border border-border bg-background p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-soft"
                  >
                    <h4 className="font-medium text-foreground">{item.medication}</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.effects.map((effect) => (
                        <span
                          key={effect}
                          className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground transition-all duration-200 hover:bg-primary/10 hover:text-primary"
                        >
                          {effect}
                        </span>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      These are common side effects. Consult your doctor if they persist.
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Food & Lifestyle */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft animate-slide-up transition-all duration-300 hover:shadow-card hover:translate-y-[-2px]" style={{ animationDelay: "0.4s" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 transition-transform duration-300 hover:scale-110">
                  <Apple className="h-5 w-5 text-success" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">
                  Food & Lifestyle Guidance
                </h3>
              </div>
              
              <div className="space-y-3">
                {foodGuidance.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 rounded-xl border p-4 transition-all duration-300 hover:translate-x-1 ${
                      item.type === "avoid"
                        ? "border-warning/30 bg-warning/5 hover:border-warning/50"
                        : "border-success/30 bg-success/5 hover:border-success/50"
                    }`}
                  >
                    <item.icon
                      className={`h-5 w-5 shrink-0 transition-transform duration-300 hover:scale-110 ${
                        item.type === "avoid" ? "text-warning" : "text-success"
                      }`}
                    />
                    <span className="text-sm text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div id="tips" className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-soft animate-slide-up transition-all duration-300 hover:shadow-card" style={{ animationDelay: "0.5s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 transition-transform duration-300 hover:scale-110">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground">
                Helpful Tips
              </h3>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-xl border border-border bg-background p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-soft hover:translate-y-[-2px]"
                >
                  <tip.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary transition-transform duration-300 hover:scale-110" />
                  <span className="text-sm text-foreground">{tip.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <Button variant="hero" className="group">
              Download Full Report
            </Button>
            <Button variant="heroOutline" className="group">
              Set Medication Reminders
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}