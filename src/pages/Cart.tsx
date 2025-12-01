import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  Trash2,
  TestTubeDiagonal,
  Microscope,
  ClipboardList,
  ShoppingBag,
} from "lucide-react";
import { customerApi } from "../api/axios";
import { useToast } from "../context/ToastManager";

interface CartItem {
  id: string;
  product_type: "LabTest" | "Profile" | "Package" | string;
  name: string;
  price: string;
  offer_price?: string;
  product_id?: number;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  // 🧭 Fetch cart from API
  const fetchCart = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setLoading(false);
      setCartItems([]);
      return;
    }

    try {
      const res = await customerApi.get("carts/");
      const cartData =
        res?.results && res.results.length > 0 ? res.results[0] : null;
      const items = cartData?.items || [];

      // Normalize item structure
      const formatted = items.map((i: any) => ({
        id: i.id,
        product_type: i.product_type,
        name: i.product_name,
        price: i.base_price,
        offer_price: i.offer_price,
        product_id: i.product_id,
      }));

      setCartItems(formatted);
      setTotalItems(cartData?.total_items || formatted.length);
      setTotalPrice(parseFloat(cartData?.total_price || "0"));
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      showToast("Unable to load cart", "error")
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 🔔 Listen for custom cart update events (add/remove)
  useEffect(() => {
    const handleCartUpdate = () => fetchCart();

    window.addEventListener("cart-updated", handleCartUpdate);
    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, []);

  // 🧹 Remove item
  const handleRemoveItem = async (id: string) => {
    try {
      // Option 1: Backend has a dedicated endpoint (recommended)
      await customerApi.delete(`carts/items/${id}/`);

      // Option 2 (fallback): if your backend uses `remove/<uuid>/`
      // await customerApi.delete(`carts/remove/${id}/`);

      showToast("Item removed from cart", "error")
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to remove item:", err);
      showToast("Unable to remove item", "error")
    }
  };

  const handleRowClick = (item: CartItem) => {
    navigate(`/product-details/${item.product_type.toLowerCase()}/${item.product_id}`);
  };

  // 🎨 Icon helper
  const getTypeInfo = (type: string) => {
    switch (type) {
      case "LabTest":
        return {
          icon: <TestTubeDiagonal className="w-8 h-8 text-blue-500" />,
          color: "bg-blue-50",
        };
      case "Profile":
        return {
          icon: <Microscope className="w-8 h-8 text-green-500" />,
          color: "bg-green-50",
        };
      case "Package":
        return {
          icon: <ClipboardList className="w-8 h-8 text-orange-500" />,
          color: "bg-orange-50",
        };
      default:
        return {
          icon: <TestTubeDiagonal className="w-8 h-8 text-gray-400" />,
          color: "bg-gray-50",
        };
    }
  };

  const user = localStorage.getItem("user");

  // 🧭 Unauthenticated state
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header showSearch />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Please Login to View Your Cart
          </h1>
          <p className="text-gray-600 mb-8">
            You need to sign in before accessing your saved tests and packages.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-secondary transition font-medium"
          >
            Go Home
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  // ⏳ Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header showSearch />
        <main className="flex items-center justify-center h-96">
          <p className="text-gray-500 text-lg">Loading your cart...</p>
        </main>
        <Footer />
      </div>
    );
  }

  // 🛒 Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header showSearch />

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="text-center flex flex-col items-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Your cart is empty
            </h1>

            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base px-4 sm:px-0">
              Add some lab tests to get started with your booking.
            </p>

            <Link
              to="/products"
              className="
              inline-flex items-center justify-center
              bg-primary text-white
              px-6 py-2.5 sm:px-8 sm:py-3
              rounded-lg
              text-sm sm:text-base
              hover:bg-secondary
              transition-colors font-medium
            "
            >
              Browse Tests
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }


  // 🧾 Main cart layout
  return (
    <div className="min-h-screen bg-gray-50">
      <Header showSearch />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Cart</h1>
          <p className="text-gray-600">
            {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const { icon, color } = getTypeInfo(item.product_type);
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 
                   flex flex-col sm:flex-row sm:items-start sm:justify-between 
                   gap-4 hover:shadow-md transition"
                >
                  {/* LEFT SECTION */}
                  <div
                    className="flex items-start gap-3 flex-1 cursor-pointer"
                    onClick={() => handleRowClick(item)}
                  >
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center ${color}`}
                    >
                      {icon}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-base sm:text-lg text-gray-900 leading-snug">
                        {item.name}
                      </h3>

                      <p className="text-xs sm:text-sm text-gray-500 capitalize mt-1">
                        {item.product_type}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT SECTION */}
                  <div className="flex flex-row sm:flex-col items-end sm:items-end justify-between sm:justify-start gap-2">
                    <div className="text-right sm:text-right">
                      <p className="text-base sm:text-lg font-semibold text-gray-900">
                        ₹{item.offer_price || item.price}
                      </p>

                      {item.offer_price && (
                        <p className="text-xs text-gray-500 line-through">
                          ₹{item.price}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-800 flex items-center text-xs sm:text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>


          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Home Collection</span>
                  <span className="text-green-600">Free</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-secondary transition font-medium text-center block"
              >
                Proceed to Checkout
              </Link>
              <Link
                to="/products"
                className="w-full mt-3 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition font-medium text-center block"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
