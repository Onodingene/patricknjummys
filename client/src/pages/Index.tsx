import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CakeCustomizer from "@/components/CakeCustomizer";
import Gallery from "@/components/Gallery";
import LastMinuteOrders from "@/components/LastMinuteOrders";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* <Header /> */}
      <HeroSection />
      <CakeCustomizer />
      <Gallery />
      <LastMinuteOrders />
    </div>
  );
};

export default Index;
