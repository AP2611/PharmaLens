import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { PrescriptionInputSection } from "@/components/sections/PrescriptionInputSection";
import { MedicationDashboard } from "@/components/sections/MedicationDashboard";
import { PrescriptionAnalysis } from "@/lib/api";

const Index = () => {
  const [currentAnalysis, setCurrentAnalysis] = useState<PrescriptionAnalysis | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <PrescriptionInputSection onAnalysisComplete={setCurrentAnalysis} />
        <MedicationDashboard analysis={currentAnalysis} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
