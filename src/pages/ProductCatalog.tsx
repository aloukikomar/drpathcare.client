import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { debounce } from "lodash";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { globalApi } from "../api/axios";
import LoginModal from "../components/LoginModal";
import { useToast } from "../context/ToastManager";

interface Product {
  id: number;
  name: string;
  price: string;
  offer_price?: string;
  category_name?: string;
  reported_on?: string;
  image?: string | null;
  description?: string;
  tests?: any[];
  profiles?: any[];
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

const PRODUCT_TYPE_OPTIONS = [
  { label: "Lab Tests", value: "lab_test", endpoint: "client/lab-tests/" },
  // { label: "Lab Profiles", value: "lab_profile", endpoint: "client/lab-profiles/" },
  { label: "Lab Packages", value: "lab_package", endpoint: "client/lab-packages/" },
];

const CATEGORY_ENTITY_MAP: Record<string, string> = {
  lab_test: "lab_test",
  lab_profile: "lab_profile",
  lab_package: "lab_package",
};

const ProductCatalog: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // 🔹 Filters
  const [productType, setProductType] = useState<string>(
    searchParams.get("product_type") || "lab_test"
  );
  const [category, setCategory] = useState<string>(
    searchParams.get("category") || ""
  );
  const [searchTerm, setSearchTerm] = useState<string>(
    searchParams.get("search") || ""
  );
  const [sortBy, setSortBy] = useState<string>("popularity");

  // 🔹 Data
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [count, setCount] = useState<number>(0);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { showToast } = useToast();

  const fetchCategories = async (type: string) => {
    try {
      const res = await globalApi.get(
        `client/lab-category/?page=1&page_size=1000&entity_type=${CATEGORY_ENTITY_MAP[type]}`
      );

      setCategories(res.results || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setCategories([]);
    }
  };

  // 🧭 Build API URL
  const buildApiUrl = (pageUrl?: string): string => {
    if (pageUrl) return pageUrl;
    const base =
      PRODUCT_TYPE_OPTIONS.find((t) => t.value === productType)?.endpoint ||
      "client/lab-tests/";
    const params = new URLSearchParams();
    params.set("page_size", "9");
    if (searchTerm) params.set("search", searchTerm);
    if (category) params.set("category", category);
    return `${base}?${params.toString()}`;
  };

  // 🧭 Fetch products
  const fetchProducts = async (pageUrl?: string) => {
    setLoading(true);
    try {
      const data = await globalApi.get<PaginatedResponse<Product>>(
        buildApiUrl(pageUrl)
      );
      let results = data.results;

      if (sortBy === "price-low") {
        results = [...results].sort(
          (a, b) =>
            parseFloat(a.offer_price || a.price) -
            parseFloat(b.offer_price || b.price)
        );
      } else if (sortBy === "price-high") {
        results = [...results].sort(
          (a, b) =>
            parseFloat(b.offer_price || b.price) -
            parseFloat(a.offer_price || a.price)
        );
      }

      setProducts(results);
      setCount(data.count);
      setNextPage(data.next);
      setPrevPage(data.previous);
    } catch (error) {
      console.error("Error fetching products:", error);
      showToast("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Debounced search
  const debouncedSearch = useCallback(
    debounce((val: string) => {
      setSearchParams({
        product_type: productType,
        ...(category && { category }),
        ...(val && { search: val }),
      });
    }, 400),
    [productType, category]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  // 🪄 Hooks
  useEffect(() => {
  const pt = searchParams.get("product_type") || "lab_test";
  const cat = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";

  setProductType(pt);
  setCategory(cat);
  setSearchTerm(search);
}, [searchParams]);


  useEffect(() => {
    fetchCategories(productType);

    // only reset category if it's NOT coming from URL
    if (!searchParams.get("category")) {
      setCategory("");
    }
  }, [productType]);

  useEffect(() => {
    fetchProducts();
  }, [productType, category, searchTerm, sortBy]);


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={(user) => {
          console.log("Logged in:", user);
          window.location.reload()
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Lab Products
          </h1>
          <p className="text-gray-600">
            Browse our collection of lab tests, profiles, and packages.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 items-center">
            {/* 🔍 Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search for tests, profiles, or packages..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* 🧩 Product Type */}
            <div>
              <select
                value={productType}
                onChange={(e) => {
                  setProductType(e.target.value);
                  setSearchParams({
                    product_type: e.target.value,
                    ...(searchTerm && { search: searchTerm }),
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {PRODUCT_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 🏷 Category */}
            <div>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSearchParams({
                    product_type: productType,
                    ...(e.target.value && { category: e.target.value }),
                    ...(searchTerm && { search: searchTerm }),
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 🔽 Sort */}
            <div>
              <select
                disabled
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="popularity">Sort: Popularity</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-gray-600">No results found.</div>
        ) : (
          <>
            <p className="text-gray-600 mb-4">
              Showing {products.length} of {count} results
            </p>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => {
                const currentType =
                  productType === "lab_test"
                    ? "LabTest"
                    : productType === "lab_profile" ? "Profile" : "Package";

                return (
                  <ProductCard
                    key={p.id}
                    product={p}
                    productType={currentType}
                  />
                );
              })}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center space-x-4 mt-8">
              <button
                onClick={() => prevPage && fetchProducts(prevPage)}
                disabled={!prevPage}
                className={`flex items-center px-4 py-2 rounded-md border ${prevPage
                  ? "bg-white text-gray-700 hover:bg-gray-100"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </button>
              <button
                onClick={() => nextPage && fetchProducts(nextPage)}
                disabled={!nextPage}
                className={`flex items-center px-4 py-2 rounded-md border ${nextPage
                  ? "bg-white text-gray-700 hover:bg-gray-100"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductCatalog;
