// src/components/about/MissionVisionValues.tsx
const MissionVisionValues = () => (
  <section className="bg-gray-50 py-14 px-6">
    <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
        <p className="text-gray-600">
          To deliver accurate, affordable & timely diagnostic services for healthier communities.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-xl font-semibold mb-3">Our Vision</h3>
        <p className="text-gray-600">
          To be the most trusted diagnostic partner powered by innovation & compassion.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-xl font-semibold mb-3">Our Values</h3>
        <p className="text-gray-600">
          Accuracy • Empathy • Transparency • Speed • Ethics • Innovation
        </p>
      </div>

    </div>
  </section>
);

export default MissionVisionValues;
