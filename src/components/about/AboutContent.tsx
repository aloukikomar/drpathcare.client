// src/components/about/AboutContent.tsx
const AboutContent = () => (
  <section className="max-w-6xl mx-auto px-6 py-14">
    <div className="grid md:grid-cols-2 gap-10 items-center">

      <div>
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Who We Are</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Dr Pathcare is a trusted diagnostics provider offering high-quality pathology, 
          radiology and preventive health services. With advanced laboratory infrastructure 
          and experienced technicians, we deliver fast & accurate reports for better health decisions.
        </p>

        <p className="text-gray-700 leading-relaxed mb-4">
          Our mission is to make diagnostics reliable, affordable & accessible, backed by 
          strong ethics, continuous innovations, and compassionate care.
        </p>

        <p className="text-gray-700 leading-relaxed">
          We perform hundreds of routine & specialized tests daily with strict quality checks, 
          ensuring every patient receives precise results.
        </p>
      </div>

      <img
        src="/icons/logo1.png"
        alt="Lab Facility"
        className="rounded-xl  w-full object-cover"
      />
    </div>
  </section>
);

export default AboutContent;
