import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { PrescriptionInputSection } from "@/components/sections/PrescriptionInputSection";
import { MedicationDashboard } from "@/components/sections/MedicationDashboard";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <PrescriptionInputSection />
        <MedicationDashboard />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
