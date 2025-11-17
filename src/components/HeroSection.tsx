import React, { useState, useEffect } from "react";
import { Shield, Clock, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "../components/SearchBar";

const HeroSection: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  const images = [
    "https://drpathcare.com/crm/public/uploads/banner/dr_path_carea0d1c5daefdf74802f83433813392e30.png",
    "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-sky-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Book Lab Tests
                <span className="text-primary"> Online</span>
                <br />
                Get Results Fast
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Convenient, accurate, and affordable lab testing services. Book
                from 1000+ tests with home collection available.
              </p>
            </div>

            {/* Reusable SearchBar */}
            <div className="relative">
              <SearchBar />
            </div>

            {/* Booking Options */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {/* 📞 Book via Phone */}
              <button
                onClick={() => setShowPhoneModal(true)}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-medium transition-all duration-200 bg-blue-100 hover:bg-blue-200"
              >
                <img
                  src="/icons/phone.png"
                  alt="Book via phone"
                  className="w-6 h-6 object-contain"
                />
                Book via Phone
              </button>

              {/* 💬 Book via WhatsApp */}
              <a
                href="https://api.whatsapp.com/send/?phone=918505805058&text=Hi%20DrPathCare!%20I%20want%20to%20book%20a%20lab%20test.&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-medium transition-all duration-200 bg-green-100 hover:bg-green-200"
              >
                <img
                  src="/icons/whatsapp.png"
                  alt="Book via whatsapp"
                  className="w-6 h-6 object-contain"
                />
                Book via WhatsApp
              </a>
            </div>

            {/* Modal for Phone Booking */}
            {showPhoneModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full text-center relative">
                  <button
                    onClick={() => setShowPhoneModal(false)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    Get Assistance in Booking a Lab Test
                  </h3>
                  <p className="text-gray-600 mb-5 text-sm">
                    Our health advisors will connect with you to understand your needs and help you choose the right test.
                  </p>

                  <div className="space-y-2 text-gray-800">
                    <p className="font-medium">📞 +91-9876543210</p>
                    <p className="font-medium">📞 +91-9123456789</p>
                  </div>

                  <button
                    onClick={() => setShowPhoneModal(false)}
                    className="mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">NABL Certified</h3>
                  <p className="text-sm text-gray-600">Accurate results</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                  <Home className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Home Collection</h3>
                  <p className="text-sm text-gray-600">Free sample pickup</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Quick Reports</h3>
                  <p className="text-sm text-gray-600">Same day results</p>
                </div>
              </div>
            </div>
          </div>

          {/* Slideshow Banner */}
          <div className="hidden lg:block relative">
            <div className="relative w-full h-96 lg:h-[500px] overflow-hidden rounded-2xl shadow-2xl">
              <AnimatePresence>
                <motion.img
                  key={currentImageIndex}
                  src={images[currentImageIndex]}
                  alt="Medical professional with lab equipment"
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  loading="lazy"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
