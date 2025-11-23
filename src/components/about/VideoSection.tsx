// src/components/about/VideoSection.tsx
const VideoSection = () => (
  <section className="py-14 px-6 bg-white">
    <h2 className="text-3xl font-bold text-center mb-8">Inside Our Lab</h2>

    <div className="max-w-4xl mx-auto">
      <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
        <iframe
          src="https://www.youtube.com/embed/LAyGJsKta2k"
          className="w-full h-full"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  </section>
);

export default VideoSection;
