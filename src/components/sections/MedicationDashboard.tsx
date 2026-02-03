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
import { Download } from "lucide-react";
import { PrescriptionResponse } from "@/lib/api";
import { generatePrescriptionPDF } from "@/utils/pdfGenerator";
import { useAuth } from "@/contexts/AuthContext";

interface MedicationDashboardProps {
  prescription: PrescriptionResponse['data'] | null;
}

export function MedicationDashboard({ prescription }: MedicationDashboardProps) {
  const { user } = useAuth();
  
  if (!prescription || !prescription.analysis) {
    return (
      <section id="guide" className="py-20 bg-muted/30">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center animate-fade-in">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Your Medication Guide
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Analyze a prescription to see your personalized medication guide here.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const analysis = prescription.analysis;

  // Handle PDF download
  const handleDownloadPDF = async () => {
    try {
      await generatePrescriptionPDF({
        analysis: analysis,
        rawText: prescription.rawText,
        userName: user?.name,
        createdAt: prescription.createdAt,
      });
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  // Transform medication schedule for display
  const medications = analysis.medication_schedule.map((med) => ({
    name: med.medicine,
    schedule: med.timing,
    dosage: med.dosage,
    instructions: med.instructions,
    times: med.timing.split(/[,\s]+and|,|\s+/).filter(Boolean).map(t => t.trim()),
  }));

  // Transform harmful combinations
  const safetyWarnings = [
    ...analysis.harmful_combinations.map(combo => ({
      level: "warning" as const,
      title: `Avoid taking ${combo.medicines.join(" and ")} together`,
      description: `${combo.risk}. ${combo.recommendation}`,
    })),
    ...analysis.overdose_warnings.map(warning => ({
      level: "warning" as const,
      title: `Overdose Warning: ${warning.medicine}`,
      description: `${warning.warning}. Maximum daily dose: ${warning.max_daily_dose}`,
    })),
  ];

  // Transform side effects
  const sideEffects = [
    ...analysis.side_effects.common.map(effect => ({
      medication: effect.medicine,
      effects: effect.effects,
      severity: "common" as const,
    })),
    ...analysis.side_effects.serious.map(effect => ({
      medication: effect.medicine,
      effects: effect.effects,
      severity: "serious" as const,
      actionRequired: effect.action_required,
    })),
  ];

  // Transform food interactions
  const foodGuidance = analysis.food_interactions.map(interaction => ({
    icon: interaction.food_item.toLowerCase().includes("caffeine") || interaction.food_item.toLowerCase().includes("coffee") 
      ? Coffee 
      : Apple,
    text: `${interaction.medicine}: ${interaction.interaction}`,
    type: interaction.recommendation.toLowerCase().includes("avoid") ? "avoid" as const : "recommended" as const,
  }));

  // Add lifestyle advice
  const lifestyleItems = analysis.lifestyle_advice.map(advice => ({
    icon: advice.restrictions.some(r => r.toLowerCase().includes("sleep") || r.toLowerCase().includes("night")) 
      ? Moon 
      : Droplets,
    text: `${advice.medicine}: ${advice.advice}`,
    type: "recommended" as const,
  }));

  const allFoodGuidance = [...foodGuidance, ...lifestyleItems];

  // Transform tips
  const tips = analysis.general_tips.map((tip, index) => {
    const iconMap = [
      Clock,
      Moon,
      Pill,
    ];
    return {
      icon: iconMap[index % iconMap.length] || Lightbulb,
      text: tip,
    };
  });

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
            {medications.length > 0 && (
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
                  {medications.map((med, index) => (
                    <div
                      key={med.name}
                      className="rounded-xl border border-border bg-background p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-soft"
                      style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground">{med.name}</h4>
                          <p className="mt-1 text-sm text-muted-foreground">{med.schedule}</p>
                          {med.dosage && (
                            <p className="mt-1 text-xs text-muted-foreground">Dosage: {med.dosage}</p>
                          )}
                          {med.instructions && (
                            <p className="mt-1 text-xs text-muted-foreground">{med.instructions}</p>
                          )}
                        </div>
                        {med.times.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {med.times.slice(0, 3).map((time) => (
                              <span
                                key={time}
                                className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-all duration-200 hover:bg-primary/20"
                              >
                                {time}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Safety Warnings */}
            {safetyWarnings.length > 0 && (
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
            )}

            {/* Side Effects */}
            {sideEffects.length > 0 && (
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
                  {sideEffects.map((item, index) => (
                    <div
                      key={`${item.medication}-${index}`}
                      className={`rounded-xl border p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-soft ${
                        item.severity === "serious" ? "border-warning/30 bg-warning/5" : "border-border bg-background"
                      }`}
                    >
                      <h4 className="font-medium text-foreground">{item.medication}</h4>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {item.effects.map((effect) => (
                          <span
                            key={effect}
                            className={`rounded-full px-3 py-1 text-xs transition-all duration-200 ${
                              item.severity === "serious"
                                ? "bg-warning/20 text-warning-foreground hover:bg-warning/30"
                                : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                            }`}
                          >
                            {effect}
                          </span>
                        ))}
                      </div>
                      {item.severity === "serious" && item.actionRequired && (
                        <p className="mt-2 text-xs font-medium text-warning">
                          ⚠️ {item.actionRequired}
                        </p>
                      )}
                      {item.severity === "common" && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          These are common side effects. Consult your doctor if they persist.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Food & Lifestyle */}
            {allFoodGuidance.length > 0 && (
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
                  {allFoodGuidance.map((item, index) => (
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
            )}
          </div>

          {/* Tips Section */}
          {tips.length > 0 && (
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
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <Button variant="hero" className="group" onClick={handleDownloadPDF}>
              <Download className="mr-2 h-4 w-4 transition-transform group-hover:translate-y-[-2px]" />
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
