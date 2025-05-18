import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import AdministrationSection from "@/components/administration-section"
import AboutSection from "@/components/about-section"
import ProgramsSection from "@/components/programs-section"
import PostsSection from "@/components/posts-section"
import GallerySection from "@/components/gallery-section"
import ContactSection from "@/components/contact-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <AdministrationSection />
        <AboutSection />
        <ProgramsSection />
        <PostsSection />
        <GallerySection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
