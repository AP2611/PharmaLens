import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { PrescriptionInputSection } from "@/components/sections/PrescriptionInputSection";
import { MedicationDashboard } from "@/components/sections/MedicationDashboard";
import { PrescriptionResponse } from "@/lib/api";

const Index = () => {
  const [currentPrescription, setCurrentPrescription] = useState<PrescriptionResponse['data'] | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <PrescriptionInputSection onAnalysisComplete={(data) => setCurrentPrescription(data)} />
        <MedicationDashboard prescription={currentPrescription} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
