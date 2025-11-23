// src/components/about/AboutHero.tsx

const AboutHero = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-16 px-6 text-center relative overflow-hidden">

      <div className="absolute top-10 left-10 w-40 h-40 bg-blue-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-44 h-44 bg-blue-400/20 rounded-full blur-3xl"></div>

      <div className="relative max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          About Dr Pathcare
        </h1>

        <p className="text-gray-700 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto">
          Delivering accurate, affordable & patient-centric diagnostics since more than a decade.
          With experienced professionals and modern equipment, we ensure trustworthy results.
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <div className="text-3xl font-bold text-primary">10,00,000+</div>
            <div className="text-sm text-gray-600">Patients Served</div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <div className="text-3xl font-bold text-primary">25000+</div>
            <div className="text-sm text-gray-600">Home Collections</div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <div className="text-3xl font-bold text-primary">3</div>
            <div className="text-sm text-gray-600">Quality Certifications</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
