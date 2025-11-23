// src/components/about/AboutPage.tsx
import Header from "../components/Header";
import Footer from "../components/Footer";
import AboutHero from "../components/about/AboutHero";
import AboutContent from "../components/about/AboutContent";
import MissionVisionValues from "../components/about/MissionVisionValues";
import Certifications from "../components/about/Certifications";
import VideoSection from "../components/about/VideoSection";
import GallerySection from "../components/about/GallerySection";
import WhyChooseUs from "../components/about/WhyChooseUs";

const AboutPage = () => (
  <div className="bg-white">
    <Header />

    <AboutHero />
    <AboutContent />
    <MissionVisionValues />
    <Certifications />
    <VideoSection />
    <GallerySection />
    <WhyChooseUs />

    <Footer />
  </div>
);

export default AboutPage;
