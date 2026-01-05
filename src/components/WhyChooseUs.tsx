import React from 'react';
import { Shield, Home, Clock, Award, Users, Headphones } from 'lucide-react';

const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'NABL Certified Labs',
      description: 'All our partner labs are NABL certified ensuring highest quality and accuracy in test results.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: <Home className="w-8 h-8" />,
      title: 'Free Home Collection',
      description: 'Convenient sample collection from your home at no extra cost. Safe and hygienic process.',
      color: 'bg-teal-100 text-teal-600'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Quick Results',
      description: 'Get your test results within 24-72 hours. Digital reports delivered to your email.',
      color: 'bg-sky-100 text-sky-600'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Best Prices',
      description: 'Competitive pricing with regular discounts and health packages for maximum savings.',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: '1M+ Happy Customers',
      description: 'Trusted by over 1 million customers across the country for their health testing needs.',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support to help you with bookings, reports, and queries.',
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Dr Pathcare?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're committed to providing you with the best lab testing experience with quality, convenience, and care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* <div className="mt-16 bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 lg:p-12 text-center text-white">
          <h3 className="text-2xl lg:text-3xl font-bold mb-4">
            Ready to Book Your Test?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Join millions of satisfied customers who trust us with their health.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Book Now
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors">
              Call Us: +1 (555) 123-4567
            </button>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default WhyChooseUs;