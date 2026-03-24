import HeroSection from "./HeroSection";
import CardsScrollSection from "./CardsScrollSection";
import ExchangeRateSection from "./ExchangeRateSection";
import MobileAppSection from "./MobileAppSection";
import TransferServicesSection from "./TransferServicesSection";
import DigitalBankingSolutionsSection from "./DigitalBankingSolutionsSection";
import CorrespondentBanksSection from "./CorrespondentBanksSection";
import ProductsAndServicesSection from "./ProductsAndServicesSection";
import LatestNewsSection from "./LatestNewsSection";
import StatsSection from "./StatsSection";
import Footer from "../Footer";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <CardsScrollSection />
      <ExchangeRateSection />
      <MobileAppSection />
      <TransferServicesSection />
      <DigitalBankingSolutionsSection />
      <LatestNewsSection />
      <CorrespondentBanksSection />
      <ProductsAndServicesSection />
      <StatsSection />
      <Footer />
    </div>
  );
}
