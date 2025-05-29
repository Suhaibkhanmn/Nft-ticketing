import { HeroSection } from "@/components/home/hero-section";
import { EventsList } from "@/components/home/events-list";
import { FeaturesSection } from "@/components/home/features-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { CallToAction } from "@/components/home/call-to-action";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24">
        <EventsList />
        <FeaturesSection />
        <TestimonialsSection />
        <CallToAction />
      </div>
    </div>
  );
}