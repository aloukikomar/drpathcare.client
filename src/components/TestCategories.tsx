import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Droplets, Activity, Bone, Stethoscope, Zap } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  testCount: number;
  color: string;
}

const TestCategories: React.FC = () => {
  const categories: Category[] = [
    {
      id: 'heart',
      name: 'Heart',
      description: 'Cardiovascular tests and screenings',
      icon: <Heart className="w-6 h-6" />,
      testCount: 25,
      color: 'bg-red-100 text-red-600'
    },
    {
      id: 'diabetes',
      name: 'Diabetes',
      description: 'Blood sugar and diabetes monitoring',
      icon: <Droplets className="w-6 h-6" />,
      testCount: 18,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'hormones',
      name: 'Hormones',
      description: 'General hormone tests',
      icon: <Zap className="w-6 h-6" />,
      testCount: 12,
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: 'liver-function',
      name: 'Liver Function',
      description: 'Liver health and enzyme tests',
      icon: <Activity className="w-6 h-6" />,
      testCount: 15,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'kidney-function',
      name: 'Kidney Function',
      description: 'Kidney health and function tests',
      icon: <Stethoscope className="w-6 h-6" />,
      testCount: 20,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'bone-health',
      name: 'Bone Health',
      description: 'Bone density and mineral tests',
      icon: <Bone className="w-6 h-6" />,
      testCount: 10,
      color: 'bg-orange-100 text-orange-600'
    },

  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Browse by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find the right tests for your health needs. Organized by body systems and conditions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${category.color} group-hover:scale-110 transition-transform duration-300`}>
                  {category.icon}
                </div>
                <span className="text-sm text-gray-500 font-medium">
                  {category.testCount} tests
                </span>
              </div>

              <h3
                className="
    font-semibold text-lg mb-2 text-gray-900 
    transition-all 
    group-hover:text-transparent 
    group-hover:bg-clip-text 
    group-hover:bg-gradient-to-r 
    group-hover:from-primary 
    group-hover:to-secondary
  "
              >
                {category.name}
              </h3>

              <p className="text-gray-600 text-sm">
                {category.description}
              </p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/products"
            className="
                      inline-flex items-center font-medium
                      text-primary
                      transition-all
                      hover:text-transparent hover:bg-clip-text
                      hover:bg-gradient-to-r hover:from-primary hover:to-secondary
                    "
          >
            View All Tests
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>

        </div>
      </div>
    </section>
  );
};

export default TestCategories;