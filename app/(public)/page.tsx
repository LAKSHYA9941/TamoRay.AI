import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { HeroSection } from "@/components/home/HeroSection";
import { DemoVideoSection } from "@/components/home/DemoVideoSection";
import { ShowcaseSection } from "@/components/home/ShowcaseSection";
import { PricingSection } from "@/components/home/PricingSection";
import { Footer } from "@/components/home/Footer";

export default async function Home() {
  const { userId } = await auth();
  if (userId) {
    redirect('/dashboard')
  }

  return (
    // Set min-h-screen and black background for the entire page body
    <div className="w-full overflow-x-hidden min-h-screen bg-black">

      {/* 1. HERO SECTION (VORTEX BACKGROUND) */}
      <HeroSection />

      <div className="w-full h-px bg-gray-800" />

      {/* 2. DEMO VIDEO SECTION */}
      <DemoVideoSection />

      <div className="w-full h-px bg-gray-800" />

      {/* 3. THUMBNAIL SHOWCASE & FACTS */}
      <ShowcaseSection />

      <div className="w-full h-px bg-gray-800" />

      {/* 4. PRICING SECTION */}
      <PricingSection />

      <div className="w-full h-px bg-gray-800" />

      {/* 5. FOOTER */}
      <Footer />

    </div>
  );
}