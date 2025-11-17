import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  TestTubeDiagonal,
  Microscope,
  ClipboardList,
} from "lucide-react";
import { globalApi, customerApi } from "../api/axios";
import { toast } from "react-toastify";
import ProductCard from "./ProductCard";

interface Product {
  id: number;
  name: string;
  price: string;
  offer_price?: string;
  category_name?: string;
  reported_on?: string;
  description?: string;
  tests?: any[];
  profiles?: any[];
}

const tabs = [
  {
    label: "Lab Tests",
    value: "lab-tests",
    type: "LabTest",
    icon: <TestTubeDiagonal className="w-6 h-6 text-blue-600" />,
    color: "text-blue-600 border-blue-600",
  },
  {
    label: "Profiles",
    value: "lab-profiles",
    type: "Profile",
    icon: <Microscope className="w-6 h-6 text-green-600" />,
    color: "text-green-600 border-green-600",
  },
  {
    label: "Packages",
    value: "lab-packages",
    type: "Package",
    icon: <ClipboardList className="w-6 h-6 text-orange-600" />,
    color: "text-orange-600 border-orange-600",
  },
];

const FeaturedDiagnostics: React.FC = () => {
  const [activeTab, setActiveTab] = useState("lab-tests");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // 🧭 Fetch Featured Products
  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        const res = await globalApi.get(`/client/${activeTab}/?is_featured=true`);
        setProducts(res.results || res);
      } catch (err) {
        console.error("Failed to load featured products", err);
        toast.error("Failed to load featured products");
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, [activeTab]);

  // 🛒 Add to Cart
  const handleAddToCart = async (product: Product, type: string) => {
    const user = localStorage.getItem("user");
    if (!user) {
      toast.info("Please login to add items to your cart");
      return;
    }

    try {
      await customerApi.post("carts/", {
        product_type: type,
        product_id: product.id,
      });
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error("Add to cart failed:", error);
      toast.error("Unable to add to cart");
    }
  };

  const currentTab = tabs.find((t) => t.value === activeTab);
  const currentType = (currentTab?.type || "LabTest") as "LabTest" | "Profile" | "Package";

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Featured Diagnostics
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore top recommended lab tests, profiles, and packages — handpicked by our experts.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center space-x-3 border-b border-gray-200 mb-8 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg transition-colors whitespace-nowrap font-medium ${
                  isActive
                    ? `bg-white border-b-2 border-primary text-primary`
                    : `${tab.color} opacity-80 hover:opacity-100`
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Product List */}
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No featured {activeTab.replace("lab-", "")} available.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.slice(0, 3).map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                productType={currentType}
                onAddToCart={() => handleAddToCart(p, currentType)}
              />
            ))}
          </div>
        )}

        {/* View All */}
        <div className="text-center mt-12">
          <Link
            to={`/products?product_type=${activeTab.replace("lab-", "lab_")}`}
            className="inline-flex items-center bg-primary text-white px-8 py-3 rounded-lg hover:bg-secondary transition font-medium"
          >
            View All {currentTab?.label}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDiagnostics;
