import ComboSection from "../../sections/home/Combo";
import ServiceSection from "../../sections/home/ServiceSection";
import PricingSecsion from "../../sections/home/Pricing";
import BrandsCarouselSecsion from "../../sections/home/BrandsCarousel";
import BannerSection from "../../sections/shared/Banner";

export default function HomePage() {
  return (
    <>
        <BannerSection
        slides={[
            {
            image: "https://img5.thuthuatphanmem.vn/uploads/2022/01/16/hinh-anh-barber-dep-chat-nhat-viet-nam_021743225.jpg",
            eyebrow: "Trendy Salon & Spa",
            title: "Dịch Vụ",
            description: "Crafted with passion since 2018...",
            },
        ]} height="700px"
        />
      <ServiceSection />
      <PricingSecsion/>
      <ComboSection />
      <BrandsCarouselSecsion/>
    </>
  );
}