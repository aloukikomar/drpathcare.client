// src/components/about/WhyChooseUs.tsx
import { Shield, Clock, Microscope, Home } from "lucide-react";

const items = [
  { icon: Shield, title: "Trusted Accuracy", desc: "Quality-checked reports with top validation." },
  { icon: Microscope, title: "Advanced Equipment", desc: "Latest analyzers ensuring precision." },
  { icon: Clock, title: "Fast Reports", desc: "Quick turnaround with digital delivery." },
  { icon: Home, title: "Home Collection", desc: "Doorstep sample collection across the city." },
];

const WhyChooseUs = () => (
  <section className="py-14 px-6">
    <h2 className="text-3xl font-bold text-center mb-10">Why Choose Dr Pathcare?</h2>

    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
      {items.map((item, idx) => (
        <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border text-center">
          <item.icon className="w-10 h-10 text-primary mx-auto mb-3" />
          <h3 className="text-lg font-semibold">{item.title}</h3>
          <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default WhyChooseUs;
