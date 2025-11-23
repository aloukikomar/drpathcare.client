import React, { useState, useCallback, useRef } from "react";
import { Search, ShoppingCart } from "lucide-react";
import { debounce } from "lodash";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { globalApi, customerApi } from "../api/axios";
import { toast } from "react-toastify";
import LoginModal from "./LoginModal";

interface SearchItem {
  id: number;
  name: string;
  type: "LabTest" | "Profile" | "Package" | string;
}

interface SearchResponse {
  results: SearchItem[];
}

interface Props {
  placeholder?: string;
  compact?: boolean;
}

const getTagColor = (type: string) => {
  switch (type) {
    case "LabTest":
      return "bg-blue-100 text-blue-600";
    case "Profile":
      return "bg-green-100 text-green-600";
    case "Package":
      return "bg-orange-100 text-orange-600";
    default:
      return "bg-gray-100 text-gray-500";
  }
};

const SearchBar: React.FC<Props> = ({
  placeholder = "Search for tests, profiles, or packages...",
  compact = false,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const navigate = useNavigate();

  // ✅ Debounced search API
  const doSearch = useCallback(
    debounce(async (q: string) => {
      if (!q.trim()) {
        setResults([]);
        setOpen(false);
        return;
      }
      setLoading(true);
      try {
        const res = await globalApi.get<SearchResponse>(
          `client/search/?q=${encodeURIComponent(q)}`
        );
        setResults(res.results || []);
        setOpen(true);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 350),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery(v);
    doSearch(v);
  };

  const handleFocus = () => {
    if (query) setOpen(true);
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const handleBlur = () => {
    closeTimer.current = window.setTimeout(() => {
      setOpen(false);
    }, 200);
  };

  const handleRowClick = (item: SearchItem) => {
    setOpen(false);
    navigate(`/product-details/${item.type.toLowerCase()}/${item.id}`);
  };

  const handleAddToCart = async (e: React.MouseEvent, item: SearchItem) => {
    e.stopPropagation();

    const user = localStorage.getItem("user");
    if (!user) {
      toast.info("Please login to add items to your cart", {
  position: "top-center",
});
      setShowLogin(true)
      return;
    }

    try {
      await customerApi.post("carts/", {
        product_type: item.type,
        product_id: item.id,
      });
      toast.success("Added to cart!");
      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Unable to add item to cart");
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
            aria-hidden="true"
          />
          <input
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={`w-full pl-12 pr-4 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 ${compact ? "h-10 text-sm" : "h-14 text-base"
              }`}
          />
        </div>

        {/* Adjusted button for compact + normal height */}
        <button
          onClick={() => doSearch.flush?.() && doSearch(query)}
          className={`rounded-r-lg text-white font-medium transition-all
                        bg-primary
                        hover:bg-gradient-to-r 
                        hover:from-primary 
                        hover:to-secondary 
                        hover:shadow-md
                        active:scale-[.98]
                        ${compact ? "px-3 py-2" : "px-8 py-4"}
                      `}
        >
          Search
        </button>
      </div>

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={(user) => {
          console.log("Logged in:", user);
          window.location.reload()
        }}
      />
      {/* Dropdown Results */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-40 w-full bg-white border border-gray-200 rounded-lg mt-2 shadow-lg max-h-80 overflow-y-auto"
          >
            {loading ? (
              <div className="p-4 text-center text-gray-500">Searching...</div>
            ) : results.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No results found.</div>
            ) : (
              results.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleRowClick(item)}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-none border-gray-100"
                >
                  <div className="flex flex-col">
                    <span className="text-gray-900 font-medium">{item.name}</span>
                    <span
                      className={`text-xs mt-1 font-semibold px-2 py-0.5 rounded-full w-fit ${getTagColor(
                        item.type
                      )}`}
                    >
                      {item.type}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleAddToCart(e, item)}
                    className="
                      w-10 h-10 rounded-lg flex items-center justify-center
                      bg-gray-100 text-gray-700
                      transition-all
                      hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white
                      hover:shadow-md
                      active:scale-95
                    "
                    title="Add to Cart"
                    aria-label={`Add ${item.name} to cart`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
