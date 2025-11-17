import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import FeaturedDiagnostics from '../components/FeaturedDiagnostics';
import TestCategories from '../components/TestCategories';
import WhyChooseUs from '../components/WhyChooseUs';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <FeaturedDiagnostics />
        <TestCategories />
        <WhyChooseUs />
      </main>
      <Footer />
    </div>
  );
};

export default Home;