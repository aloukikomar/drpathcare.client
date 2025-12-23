import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, MapPin, MapPinned } from 'lucide-react';
import globalApi from '../api/axios';
import DeveloperDetailsModal from './MyPopup';

const Footer: React.FC = () => {
  const [form, setForm] = useState({ name: "", mobile: "", enquiry: "" });
  const [submitted, setSubmitted] = useState(false);
  const [openDevPopup, setOpenDevPopup] = useState(false);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || form.mobile.length < 10) return;

    try {
      await globalApi.post("crm/enquiries/", {
        name: form.name.trim(),
        mobile: form.mobile,
        enquiry: form.enquiry.trim(),
      });

      setSubmitted(true);
      setForm({ name: "", mobile: "", enquiry: "" });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error("Enquiry submit failed:", err);
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ---------------- Company Info ---------------- */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DP</span>
              </div>
              <span className="font-inter font-bold text-xl">Dr Pathcare</span>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed">
              Your trusted partner for convenient, accurate, and affordable lab testing services.
              Book tests online and get results delivered to your doorstep.
            </p>

            <div className="flex space-x-4">
              <a href="https://www.facebook.com/DrPathcare.india" target="_blank" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://g.page/r/CVtDIcZlPbtEEBM/review" target="_blank" className="text-gray-400 hover:text-white transition-colors">
                <MapPinned className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/drpathcare41" target="_blank" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* ---------------- Quick Links ---------------- */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link className="text-gray-300 hover:text-white" to="/products?product_type=lab_test">Lab Tests</Link></li>
              <li><Link className="text-gray-300 hover:text-white" to="/products?product_type=lab_package">Health Packages</Link></li>
              <li><Link className="text-gray-300 hover:text-white" to="/account?tab=bookings">Bookings</Link></li>
              <li><Link className="text-gray-300 hover:text-white" to="/account?tab=reports">Download Reports</Link></li>
              <li><Link className="text-gray-300 hover:text-white" to="/account?tab=payments">Payments</Link></li>
            </ul>
          </div>

          {/* ---------------- Contact Info ---------------- */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Contact Info</h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-gray-300">+91-8447007794</span>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-gray-300">info@drpathcare.com</span>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span className="text-gray-300">
                  E-113, Second Floor <br />
                  Sector-6 Noida-201301
                </span>
              </div>
            </div>
          </div>

          {/* ---------------- Enquiry Form ---------------- */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Enquire Now</h3>

            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                {/* Name */}
                <input
                  required
                  type="text"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value.slice(0, 50) })}
                  className="w-full px-3 py-2 rounded bg-gray-800 text-gray-200 text-sm border border-gray-700 focus:border-primary focus:ring-primary"
                />

                {/* Mobile */}
                <input
                  required
                  type="tel"
                  placeholder="Mobile"
                  value={form.mobile}
                  onChange={(e) =>
                    setForm({ ...form, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) })
                  }
                  className="w-full px-3 py-2 rounded bg-gray-800 text-gray-200 text-sm border border-gray-700 focus:border-primary focus:ring-primary"
                />
              </div>

              <textarea
                required
                rows={2}
                placeholder="Your enquiry..."
                value={form.enquiry}
                onChange={(e) => setForm({ ...form, enquiry: e.target.value.slice(0, 500) })}
                className="w-full px-3 py-2 rounded bg-gray-800 text-gray-200 text-sm border border-gray-700 focus:border-primary focus:ring-primary"
              />

              {/* Submit */}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full py-2 rounded bg-primary text-white text-sm font-medium hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:shadow-md transition"
              >
                Submit
              </button>

              {submitted && (
                <p className="text-green-400 text-xs">Enquiry submitted successfully!</p>
              )}
            </form>
          </div>
        </div>

        {/* ---------------- Bottom Bar ---------------- */}
        <div className="border-t border-gray-800 mt-10 pt-6">

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            {/* Left */}
            <div className="text-gray-400 text-sm text-center md:text-left">
              © 2025 Dr Pathcare. All rights reserved.
            </div>

            {/* Right — Links */}
            <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm">

              <Link to="/policy/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
              <Link to="/policy/cancellation" className="text-gray-400 hover:text-white">Cancellation Policy</Link>
              <Link to="/policy/refund" className="text-gray-400 hover:text-white">Refund Policy</Link>
              <Link to="/policy/homecollection" className="text-gray-400 hover:text-white">Home Collection Policy</Link>
              <Link to="/policy/terms" className="text-gray-400 hover:text-white">Terms of Service</Link>

              <span className="text-gray-400">
                Built by{" "}
              
                <a onClick={()=>setOpenDevPopup(true)} target="_blank" className="text-primary hover:text-secondary">
                  Aloukik Omar
                </a>
              </span>
              <DeveloperDetailsModal 
              isOpen={openDevPopup}
              onClose={() => setOpenDevPopup(false)} />
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;
