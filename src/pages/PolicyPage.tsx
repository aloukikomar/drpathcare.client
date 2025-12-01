import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface PolicyPageProps {
  title: string;
  content: React.ReactNode;
}

const PolicyPage: React.FC<PolicyPageProps> = ({ title, content }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{title}</h1>

        <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6 leading-relaxed text-gray-700 space-y-4">
          {content}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PolicyPage;
