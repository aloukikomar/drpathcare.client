import React, { useEffect, useState } from "react";
import { globalApi } from "../api/axios";

interface PartnerItem {
  id: number;
  file_url: string;
  title: string;
}

const PartnersCarousel: React.FC = () => {
  const [partners, setPartners] = useState<PartnerItem[]>([]);

  const fetchPartners = async () => {
    try {
      const res = await globalApi.get("client/content/?tag_type=partner");
      setPartners(res.results || []);
    } catch (err) {
      console.error("Failed to fetch partners:", err);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  if (partners.length === 0) return null;

  // duplicate list for smooth seamless scrolling
  const loopList = [...partners, ...partners];

  return (
    <section className="py-14 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-10">
          Our Trusted Lab Partners
        </h2>

        <div className="overflow-hidden relative">
          <div
            className="flex gap-12 animate-scroll"
            style={{
              width: `${loopList.length * 240}px`,
            }}
          >
            {loopList.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="
                  bg-white rounded-xl shadow-sm border 
                  flex items-center justify-center
                  p-4 md:p-6
                  transition-transform duration-300 hover:scale-[1.05]
                  w-[150px] h-[90px] md:w-[200px] md:h-[120px]
                "
              >
                <img
                  src={item.file_url}
                  alt={item.title}
                  className="object-contain max-h-full max-w-full"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll {
            animation: scroll 18s linear infinite;
          }
        `}
      </style>
    </section>
  );
};

export default PartnersCarousel;
