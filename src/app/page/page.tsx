import BlogSection from "../../sections/home/BlogSection";
import AboutSection from "../../sections/home/AboutUs";
import ServiceSection from "../../sections/home/ServiceSection";
import AppointmentSecsion from "../../sections/home/Appointment";
import BarbersSecsion from "../../sections/home/Barbers";
import TestimonialsSecsion from "../../sections/home/Testimonials";
import PricingSecsion from "../../sections/home/Pricing";
import BrandsCarouselSecsion from "../../sections/home/BrandsCarousel";
import BannerSection from "../../sections/shared/Banner";
import GallerySection from "../../sections/page/GallerySection";

export default function HomePage() {
  return (
    <>
        <BannerSection
        slides={[
            {
            image: "https://img5.thuthuatphanmem.vn/uploads/2022/01/16/hinh-anh-barber-dep-chat-nhat-viet-nam_021743225.jpg",
            eyebrow: "Trendy Salon & Spa",
            title: "Trưng Bày",
            description: "Crafted with passion since 2018...",
            },
        ]} height="700px"
        />
      <GallerySection />
      <BrandsCarouselSecsion/>
    </>
  );
}