import BlogSection from "../sections/home/BlogSection";
import HeroSection from "../sections/home/HeroSection";
import AboutSection from "../sections/home/AboutUs";
import ServiceSection from "../sections/home/ServiceSection";
import AppointmentSecsion from "../sections/home/Appointment";
import BarbersSecsion from "../sections/home/Barbers";
import TestimonialsSecsion from "../sections/home/Testimonials";
import PricingSecsion from "../sections/home/Pricing";
import BrandsCarouselSecsion from "../sections/home/BrandsCarousel";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServiceSection />
      <AppointmentSecsion/>
      <BarbersSecsion/>
      <TestimonialsSecsion/>
      <PricingSecsion/>
      <BlogSection />
      <BrandsCarouselSecsion/>
    </>
  );
}