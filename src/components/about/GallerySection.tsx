// src/components/about/GallerySection.tsx

import { useEffect, useState } from "react";
import { customerApi } from "../../api/axios";
import { motion } from "framer-motion";

const GallerySection = () => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await customerApi.get("client/content/?tag_type=about_gallery");

        const list = res?.results || res?.data?.results || [];

        const urls = list
          .filter((item: any) => item.file_url)
          .map((item: any) => item.file_url);

        setImages(
          urls.length
            ? urls
            : Array.from({ length: 8 }, (_, i) => `/gallery/gal${i + 1}.jpg`)
        );
      } catch (err) {
        console.error("Failed to load gallery", err);
        setImages(Array.from({ length: 8 }, (_, i) => `/gallery/gal${i + 1}.jpg`));
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  return (
    <section className="py-14 px-6 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-10">Gallery</h2>

      {loading ? (
        <div className="text-center text-gray-500 py-10">Loading gallery...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {images.map((src, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="
                rounded-lg overflow-hidden 
                shadow-sm hover:shadow-lg 
                transition-all duration-300
              "
            >
              <img
                src={src}
                loading="lazy"
                className="object-cover h-40 w-full"
              />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default GallerySection;
