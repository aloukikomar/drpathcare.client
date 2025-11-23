import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, MapPin, MapPinned } from 'lucide-react';
import globalApi from '../api/axios';

const Footer: React.FC = () => {
  const [form, setForm] = useState({ name: "", mobile: "", enquiry: "" });
  const [submitted, setSubmitted] = useState(false);

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

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
              <a href="https://www.instagram.com/drpathcare41/" target="_blank" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* ---------------- Quick Links ---------------- */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?product_type=lab_test" className="text-gray-300 hover:text-white text-sm">
                  Lab Tests
                </Link>
              </li>
              {/* <li>
                <Link to="/products?product_type=lab_profile" className="text-gray-300 hover:text-white text-sm">
                  Lab Profiles
                </Link>
              </li> */}
              <li>
                <Link to="/products?product_type=lab_package" className="text-gray-300 hover:text-white text-sm">
                  Health Packages
                </Link>
              </li>
              <li>
                <Link
                  to="/account?tab=bookings"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Bookings
                </Link>

              </li>
              <li>
                <Link
                  to="/account?tab=reports"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Download Reports
                </Link>

              </li>
              <li>
                <Link
                  to="/account?tab=payments"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Payments
                </Link>

              </li>
            </ul>
          </div>

          {/* ---------------- Contact Info ---------------- */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-gray-300 text-sm">+91-8447007794</span>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-gray-300 text-sm">support@drpathcare.com</span>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span className="text-gray-300 text-sm">
                  123 Healthcare Ave<br />
                  Medical District, NY 10001
                </span>
              </div>
            </div>
          </div>

          {/* ---------------- Enquiry Form ---------------- */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Enquire Now</h3>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
              {/* Name + Mobile */}
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  type="text"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value.slice(0, 50) })
                  }
                  className="w-full px-3 py-2 rounded bg-gray-800 text-gray-200 text-sm
          border border-gray-700 focus:border-primary focus:ring-primary"
                />

                <input
                  required
                  type="tel"
                  placeholder="Mobile"
                  value={form.mobile}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      mobile: e.target.value.replace(/\D/g, "").slice(0, 10),
                    })
                  }
                  className="w-full px-3 py-2 rounded bg-gray-800 text-gray-200 text-sm
          border border-gray-700 focus:border-primary focus:ring-primary"
                />
              </div>

              {/* Enquiry */}
              <textarea
                required
                placeholder="Your enquiry..."
                rows={2}
                value={form.enquiry}
                onChange={(e) =>
                  setForm({ ...form, enquiry: e.target.value.slice(0, 500) })
                }
                className="w-full px-3 py-2 rounded bg-gray-800 text-gray-200 text-sm 
        border border-gray-700 focus:border-primary focus:ring-primary"
              />

              {/* Submit Button - Updated Hover */}
              <button
                type="button"
                onClick={handleSubmit}
                className="
                          w-full py-2 rounded text-white text-sm font-medium
                          bg-primary
                          transition-all
                          hover:bg-gradient-to-r hover:from-primary hover:to-secondary
                          hover:shadow-md
                          active:scale-[.98]
                        "
              >
                Submit
              </button>

              {submitted && (
                <p className="text-green-400 text-xs mt-1">
                  Enquiry submitted successfully!
                </p>
              )}
            </form>
          </div>



        </div>

        {/* ---------------- Bottom Bar ---------------- */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            © 2025 Dr Pathcare. All rights reserved.
          </div>

          <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
            <Link to="/privacy" className="text-gray-400 hover:text-white transition">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white transition">
              Terms of Service
            </Link>
            <span className="text-gray-400">
              Built by{" "}
              <a rel="nofollow" target="_blank" href="https://meku.dev" className="text-primary hover:text-secondary">
                Aloukik Omar
              </a>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
