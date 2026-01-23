import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Camera, 
  Upload, 
  FileText, 
  Lock, 
  CheckCircle2,
  ArrowRight,
  Loader2,
  X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { PrescriptionAnalysis } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AuthDialog } from "@/components/auth/AuthDialog";

interface PrescriptionInputSectionProps {
  onAnalysisComplete?: (analysis: PrescriptionAnalysis) => void;
}

export function PrescriptionInputSection({ onAnalysisComplete }: PrescriptionInputSectionProps) {
  const [selectedMethod, setSelectedMethod] = useState<"upload" | "manual" | null>(null);
  const [prescriptionText, setPrescriptionText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!prescriptionText.trim()) {
      toast({
        title: "Error",
        description: "Please enter prescription text",
        variant: "destructive",
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to analyze prescriptions",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await apiClient.analyzePrescription({
        rawText: prescriptionText,
      });
      
      toast({
        title: "Analysis Complete",
        description: "Your prescription has been analyzed successfully",
      });

      if (onAnalysisComplete) {
        onAnalysisComplete(response.data.analysis);
      }

      // Scroll to dashboard
      document.getElementById("guide")?.scrollIntoView({ behavior: "smooth" });
      
      // Reset form
      setPrescriptionText("");
      setShowManualInput(false);
      setSelectedMethod(null);
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze prescription",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section id="upload" className="py-20 bg-background">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center animate-fade-in">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Start with your prescription
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose how you'd like to share your prescription details. Both methods are 
            equally secure and accurate.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-5">
          {/* Doctor Image - Hidden on mobile */}
          <div className="hidden lg:block lg:col-span-2 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="sticky top-24 overflow-hidden rounded-2xl shadow-elevated">
              <img 
                src="/src/assets/doctor-consultation.jpg" 
                alt="Doctor reviewing prescription with patient" 
                className="w-full h-auto object-cover aspect-[3/4]"
                onError={(e) => {
                  // Fallback if image doesn't load
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-background/90 backdrop-blur-sm p-4 border border-border/50">
                <p className="text-sm font-medium text-foreground">
                  "PharmaLens helped me understand my medication schedule clearly."
                </p>
                <p className="mt-2 text-xs text-muted-foreground">— Sarah T., Patient</p>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="lg:col-span-3 space-y-6">
            {/* Upload Option */}
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  toast({
                    title: "Authentication Required",
                    description: "Please sign in to upload prescriptions",
                    variant: "destructive",
                  });
                  return;
                }
                setSelectedMethod("upload");
                toast({
                  title: "Coming Soon",
                  description: "Image upload feature will be available soon. Please use manual entry for now.",
                });
              }}
              className={`group relative w-full flex flex-col items-center rounded-2xl border-2 p-8 text-left transition-all duration-300 animate-slide-up ${
                selectedMethod === "upload"
                  ? "border-primary bg-primary/5 shadow-card scale-[1.02]"
                  : "border-border bg-card hover:border-primary/50 hover:shadow-soft hover:translate-y-[-2px]"
              }`}
              style={{ animationDelay: "0.1s" }}
            >
              {selectedMethod === "upload" && (
                <div className="absolute right-4 top-4 animate-scale-in">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
              )}
              
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 ${
                selectedMethod === "upload" ? "bg-primary scale-110" : "bg-accent group-hover:bg-primary/10 group-hover:scale-105"
              }`}>
                <Camera className={`h-8 w-8 transition-all duration-300 ${
                  selectedMethod === "upload" ? "text-primary-foreground" : "text-primary"
                }`} />
              </div>
              
              <h3 className="mt-6 font-display text-xl font-semibold text-foreground">
                Upload Prescription Image
              </h3>
              
              <p className="mt-3 text-center text-muted-foreground">
                Take a photo or upload an image of your prescription. We'll extract the 
                medication details automatically.
              </p>
              
              <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                {["Supports JPG, PNG, PDF", "Camera capture available", "Instant text extraction"].map((feature, index) => (
                  <li key={feature} className="flex items-center gap-2 transition-all duration-200" style={{ transitionDelay: `${index * 50}ms` }}>
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    {feature}
                  </li>
                ))}
              </ul>
            </button>

            {/* Manual Entry Option */}
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  toast({
                    title: "Authentication Required",
                    description: "Please sign in to analyze prescriptions",
                    variant: "destructive",
                  });
                  return;
                }
                setSelectedMethod("manual");
                setShowManualInput(true);
              }}
              className={`group relative w-full flex flex-col items-center rounded-2xl border-2 p-8 text-left transition-all duration-300 animate-slide-up ${
                selectedMethod === "manual"
                  ? "border-primary bg-primary/5 shadow-card scale-[1.02]"
                  : "border-border bg-card hover:border-primary/50 hover:shadow-soft hover:translate-y-[-2px]"
              }`}
              style={{ animationDelay: "0.2s" }}
            >
              {selectedMethod === "manual" && (
                <div className="absolute right-4 top-4 animate-scale-in">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
              )}
              
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 ${
                selectedMethod === "manual" ? "bg-primary scale-110" : "bg-accent group-hover:bg-primary/10 group-hover:scale-105"
              }`}>
                <FileText className={`h-8 w-8 transition-all duration-300 ${
                  selectedMethod === "manual" ? "text-primary-foreground" : "text-primary"
                }`} />
              </div>
              
              <h3 className="mt-6 font-display text-xl font-semibold text-foreground">
                Enter Prescription Manually
              </h3>
              
              <p className="mt-3 text-center text-muted-foreground">
                Type in your medication names, dosages, and schedules. Perfect for 
                adding details from memory.
              </p>
              
              <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                {["Guided form fields", "Auto-complete suggestions", "Easy medication lookup"].map((feature, index) => (
                  <li key={feature} className="flex items-center gap-2 transition-all duration-200" style={{ transitionDelay: `${index * 50}ms` }}>
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    {feature}
                  </li>
                ))}
              </ul>
            </button>

            {/* Continue Button */}
            {selectedMethod && !showManualInput && (
              <div className="flex flex-col items-center gap-4 animate-fade-in">
                <Button 
                  variant="hero" 
                  size="xl" 
                  className="w-full group"
                  onClick={() => {
                    if (selectedMethod === "manual") {
                      setShowManualInput(true);
                    }
                  }}
                >
                  Continue with {selectedMethod === "upload" ? "Upload" : "Manual Entry"}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Manual Input Dialog */}
        <Dialog open={showManualInput} onOpenChange={setShowManualInput}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Enter Prescription Details</DialogTitle>
              <DialogDescription>
                Enter your prescription text. Include medication names, dosages, and schedules.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="Example: Take Aspirin 100mg twice daily after meals. Metformin 500mg once daily with breakfast..."
                value={prescriptionText}
                onChange={(e) => setPrescriptionText(e.target.value)}
                className="min-h-[200px]"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowManualInput(false);
                    setPrescriptionText("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !prescriptionText.trim()}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Analyze Prescription
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Privacy Reassurance */}
        <div className="mx-auto mt-10 flex max-w-lg items-center justify-center gap-3 rounded-xl bg-accent/50 px-6 py-4 animate-fade-in transition-all duration-300 hover:bg-accent/70" style={{ animationDelay: "0.4s" }}>
          <Lock className="h-5 w-5 shrink-0 text-primary animate-pulse-soft" />
          <p className="text-sm text-muted-foreground">
            Your prescription data is encrypted and never shared. We follow strict 
            healthcare privacy standards.
          </p>
        </div>

        {/* Auth Prompt */}
        {!isAuthenticated && (
          <div className="mx-auto mt-6 flex max-w-lg items-center justify-center gap-3 rounded-xl bg-primary/10 px-6 py-4 animate-fade-in">
            <p className="text-sm text-foreground">
              Please <AuthDialog /> to analyze prescriptions
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
