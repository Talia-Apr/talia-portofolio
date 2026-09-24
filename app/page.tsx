import PortfolioFolder from "@/components/PortfolioFolder";
import WaveHill from "@/components/WaveHill";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-8 overflow-hidden">
      <WaveHill />
      <div className="relative z-10 w-full flex items-center justify-center">
        <PortfolioFolder />
      </div>
    </main>
  );
}