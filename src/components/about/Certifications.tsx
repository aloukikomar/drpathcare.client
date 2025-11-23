// src/components/about/Certifications.tsx
const Certifications = () => (
  <section className="max-w-6xl mx-auto px-6 py-14">
    <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Our Certifications</h2>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <img src="/images/iso_9001_2015.f24429c42c4c73f53b1e.png" className="rounded-lg shadow" alt="Certification 1" />
      <img src="/images/iso_14001_2015.37af9659a7ab2b08650c.png" className="rounded-lg shadow" alt="Certification 2" />
      <img src="/images/iso_45001_2018.082199dd997ad925d8b4.png" className="rounded-lg shadow" alt="Certification 3" />
    </div>
  </section>
);

export default Certifications;
