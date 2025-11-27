import React, { useEffect, useState } from "react";
import { globalApi } from "../../api/axios";

const Certifications = () => {
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Original static images (fallback)
  const fallbackCerts = [
    "/images/iso_9001_2015.f24429c42c4c73f53b1e.png",
    "/images/iso_14001_2015.37af9659a7ab2b08650c.png",
    "/images/iso_45001_2018.082199dd997ad925d8b4.png",
  ];

  const fetchCertifications = async () => {
    try {
      const res = await globalApi.get("/client/content/?tag_type=certification");

      const apiImages =
        res?.results?.map((item: any) => item.file_url).filter(Boolean) || [];

      setCerts(apiImages.length > 0 ? apiImages : fallbackCerts);
    } catch (error) {
      console.error("Failed to fetch certifications:", error);
      setCerts(fallbackCerts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-6 py-14">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
        Our Certifications
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {certs.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Certification ${idx + 1}`}
              className="rounded-lg shadow"
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Certifications;
