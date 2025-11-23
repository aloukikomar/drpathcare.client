import React from "react";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./src/pages/Home";
import ProductCatalog from "./src/pages/ProductCatalog";
import ProductDetails from "./src/pages/ProductDetails";
import Cart from "./src/pages/Cart";
import Checkout from "./src/pages/Checkout";
import NotFound from "./src/pages/NotFound";
import Account from "./src/pages/AccountPage";
import AboutPage from "./src/pages/AboutPage";
import BookingViewPage from "./src/pages/BookingViewPage"; // ✅ NEW IMPORT

const App: React.FC = () => {
  return (
    <Theme appearance="inherit" radius="large" scaling="100%">
      <Router>
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

            {/* ✅ NEW ROUTE FOR BOOKING VIEW */}
            <Route path="/booking/:id" element={<BookingViewPage />} />

            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            newestOnTop
            closeOnClick
            pauseOnHover
          />
        </main>
      </Router>
    </Theme>
  );
};

export default App;
