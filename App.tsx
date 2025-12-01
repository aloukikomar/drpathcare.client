import React from "react";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./src/pages/Home";
import ProductCatalog from "./src/pages/ProductCatalog";
import ProductDetails from "./src/pages/ProductDetails";
import Cart from "./src/pages/Cart";
import Checkout from "./src/pages/Checkout";
import NotFound from "./src/pages/NotFound";
import Account from "./src/pages/AccountPage";
import AboutPage from "./src/pages/AboutPage";
import BookingViewPage from "./src/pages/BookingViewPage"; 
import Terms from "./src/components/policies/Terms";

import ScrollToTop from "./src/utils/ScrollToTop";     // ✅ Added
import { CartProvider } from "./src/context/CartContext";
import { ToastProvider } from "./src/context/ToastManager";

const App: React.FC = () => {
  return (
    <Theme appearance="inherit" radius="large" scaling="100%">
      <ToastProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />  {/* ✅ Scroll to top on route change */}

            <main className="min-h-screen">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<ProductCatalog />} />
                <Route
                  path="/product-details/:product_type/:id"
                  element={<ProductDetails />}
                />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/account" element={<Account />} />

                <Route path="/booking/:id" element={<BookingViewPage />} />
                <Route path="/about" element={<AboutPage />} />

                {/* Policies */}
                <Route path="/policy/terms" element={<Terms />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </Router>
        </CartProvider>
      </ToastProvider>
    </Theme>
  );
};

export default App;
