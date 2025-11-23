import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";

import BookingsSection from "../components/account/BookingSection";
import PaymentsSection from "../components/account/PaymentsSection";
import AccountAddresses from "../components/account/AccountAddresses";
import AccountPatients from "../components/account/AccountPatients";
import AccountReports from "../components/account/AccountReports";
import AccountMe from "../components/account/AccountMe";

import {
  CalendarCheck,
  FileText,
  CreditCard,
  MapPinHouse,
  UsersRound,
  UserCircle,
} from "lucide-react";

const sections = [
  { key: "bookings", label: "Bookings", icon: CalendarCheck },
  { key: "reports", label: "Reports", icon: FileText },
  { key: "payments", label: "Payments", icon: CreditCard },
  { key: "addresses", label: "Addresses", icon: MapPinHouse },
  { key: "patients", label: "Patients", icon: UsersRound },
  { key: "me", label: "Me", icon: UserCircle },
];

const AccountPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Read initial tab from URL
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get("tab") || "bookings";

  const [active, setActive] = useState(initialTab);

  // Update active tab when URL changes (e.g. from footer link)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabFromUrl = params.get("tab");

    if (tabFromUrl && tabFromUrl !== active) {
      setActive(tabFromUrl);
    }
  }, [location.search]);

  // Clicking a tab should update URL as well
  const handleTabClick = (key: string) => {
    setActive(key);
    navigate(`/account?tab=${key}`);
  };

  // Render active section
  const ActiveSection = () => {
    switch (active) {
      case "bookings":
        return <BookingsSection />;
      case "reports":
        return <AccountReports />;
      case "payments":
        return <PaymentsSection />;
      case "addresses":
        return <AccountAddresses />;
      case "patients":
        return <AccountPatients />;
      case "me":
        return <AccountMe />
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showSearch />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* Tile Buttons */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8">
          {sections.map((s) => {
            const Icon = s.icon;
            const isActive = active === s.key;

            return (
              <button
                key={s.key}
                onClick={() => handleTabClick(s.key)}
                className={`group flex flex-col items-center p-3 rounded-lg border shadow-sm 
    text-sm transition
    ${isActive
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-primary"
                  }`}
              >

                {/* ICON */}
                <Icon
                  size={22}
                  className={`transition
      ${isActive
                      ? "text-white"
                      : "text-gray-600 group-hover:text-primary"
                    }`}
                />

                <span className="mt-1">{s.label}</span>
              </button>

            );
          })}
        </div>

        <ActiveSection />
      </main>

      <Footer />
    </div>
  );
};

export default AccountPage;
