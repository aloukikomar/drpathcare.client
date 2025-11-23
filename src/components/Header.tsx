import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import LoginModal from "../components/LoginModal";
import SearchBar from "./SearchBar";
import { customerApi } from "../api/axios";

interface HeaderProps {
  showSearch?: boolean; // 👈 controls visibility of search bar below nav
}

const Header: React.FC<HeaderProps> = ({ showSearch = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [cartCount, setCartCount] = useState<number>(0);
  const navigate = useNavigate();
  const location = useLocation();

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setCartCount(0);
    navigate("/");
    window.location.reload();
  };

  const isActive = (path: string) => location.pathname === path;

  const fetchCartCount = async () => {
    if (!user) {
      setCartCount(0);
      return;
    }
    try {
      const res = await customerApi.get("carts/");

      // 🧭 Safely extract the first (and only) cart
      const cart = Array.isArray(res.results) && res.results.length > 0 ? res.results[0] : null;

      // ✅ Prefer backend’s total_items (most accurate)
      const count = cart?.total_items || (cart?.items?.length ?? 0);

      setCartCount(count);
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
      setCartCount(0);
    }
  };

  // 🔁 Refresh on route change
  useEffect(() => {
    fetchCartCount();
  }, [location.pathname]);

  // 🔔 Listen for custom cart update events (add/remove)
  useEffect(() => {
    const handleCartUpdate = () => fetchCartCount();

    window.addEventListener("cart-updated", handleCartUpdate);
    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 🔹 Top Bar */}
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            {/* <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DP</span>
            </div>
            <span className="font-inter font-bold text-xl text-gray-900">
              Dr Pathcare
            </span> */}
            <img
              src="/icons/logo1.png"
              // alt="Book via phone"
              className="mt-7 w-36 h-24 object-contain"
            />
          </Link>

          {/* 🔹 Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`
      font-medium transition-colors
      ${isActive("/") ? "text-primary" : "text-gray-700 hover:text-primary"}
    `}
            >
              Home
            </Link>

            <Link
              to="/products?product_type=lab_test"
              className={`
      font-medium transition-colors
      ${location.search.includes("lab_test")
                  ? "text-primary"
                  : "text-gray-700 hover:text-primary"}
    `}
            >
              Lab Tests
            </Link>

            <Link
              to="/products?product_type=lab_package"
              className={`
      font-medium transition-colors
      ${location.search.includes("lab_package")
                  ? "text-primary"
                  : "text-gray-700 hover:text-primary"}
    `}
            >
              Packages
            </Link>

            <Link
              to="/about"
              className={`
      font-medium transition-colors
      ${isActive("/about")
                  ? "text-primary"
                  : "text-gray-700 hover:text-primary"}
    `}
            >
              About
            </Link>
          </nav>



          {/* 🔹 Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">

            {/* Account / Login */}
            {user ? (
              <div className="flex items-center space-x-2">
                {/* Cart */}
                <Link
                  to="/cart"
                  className="p-2 text-gray-600 hover:text-primary transition-colors relative"
                  aria-label="Shopping cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/account"
                  className="p-2 text-gray-600 hover:text-primary transition-colors relative"
                  aria-label="User"
                >
                  <User className="w-5 h-5" />
                </Link>

                <button
                  onClick={handleLogout}
                  className="
                            px-4 py-2 rounded-lg text-white font-medium
                            bg-primary
                            transition-all
                            hover:bg-gradient-to-r hover:from-primary hover:to-secondary
                            hover:shadow-md
                            active:scale-[.98]
                          "
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="
                          px-4 py-2 rounded-lg text-white font-medium
                          bg-primary
                          transition-all
                          hover:bg-gradient-to-r hover:from-primary hover:to-secondary
                          hover:shadow-md
                          active:scale-[.98]
                        "
              >
                Login / Signup
              </button>
            )}
          </div>

          {/* 🔹 Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* 🔍 Search Bar (below nav, optional) */}
        {showSearch && (
          <div className="border-t border-gray-100 py-2 bg-gray-50">
            <div className="max-w-3xl mx-auto px-2 sm:px-0">
              <SearchBar compact />
            </div>
          </div>
        )}

        <LoginModal
          isOpen={showLogin}
          onClose={() => setShowLogin(false)}
          onLoginSuccess={(user) => {
            console.log("Logged in:", user);
            fetchCartCount();
          }}
        />

        {/* 🔹 Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 bg-white">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-primary font-medium">
                Home
              </Link>
              <Link to="/products?product_type=lab_test" className="text-gray-700 hover:text-primary font-medium">
                Lab Tests
              </Link>
              <Link to="/products?product_type=lab_package" className="text-gray-700 hover:text-primary font-medium">
                Packages
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-primary font-medium">
                About
              </Link>

              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-100">
                {user ? (
                  <Link to="/cart" className="flex items-center space-x-2 text-gray-700 hover:text-primary">
                    <ShoppingCart className="w-5 h-5" />
                    <span>Cart ({cartCount})</span>
                  </Link>
                ) : null}
                {user ? (
                  <Link to="/account" className="flex items-center space-x-2 text-gray-700 hover:text-primary">
                    <User className="w-5 h-5" />
                    <span>Account</span>
                  </Link>
                ) : null}

                {user ? (
                  <button
                    onClick={handleLogout}
                    className="
                                px-4 py-2 rounded-lg text-white font-medium
                                bg-primary
                                transition-all
                                hover:bg-gradient-to-r hover:from-primary hover:to-secondary
                                hover:shadow-md
                                active:scale-[.98]
                              "
                  >
                    Logout
                  </button>
                ) : (
                  <button
                    onClick={() => setShowLogin(true)}
                    className="
                                px-4 py-2 rounded-lg text-white font-medium
                                bg-primary
                                transition-all
                                hover:bg-gradient-to-r hover:from-primary hover:to-secondary
                                hover:shadow-md
                                active:scale-[.98]
                              "
                  >
                    Login / Signup
                  </button>
                )}

              </div>

              {/* {showSearch && (
                <div className="pt-4 border-t border-gray-100">
                  <SearchBar compact />
                </div>
              )} */}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
