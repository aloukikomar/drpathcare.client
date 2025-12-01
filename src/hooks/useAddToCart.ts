import { useState } from "react";
import { customerApi } from "../api/axios";
import { useToast } from "../context/ToastManager";

export const useAddToCart = () => {
  const [openLogin, setOpenLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const addToCart = async (product: any, productTypeOverride?: string) => {
    const user = localStorage.getItem("user");

    // 🔐 If not logged in → open login modal everywhere
    if (!user) {
      setOpenLogin(true);
      showToast("Please login to add items to cart", "info")
      return;
    }

    setLoading(true);
    try {
      await customerApi.post("carts/", {
        product_type: productTypeOverride || product.productType || product.type,
        product_id: product.id,
      });
      showToast("Added to cart!", "success")
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      console.error("Add To Cart Error:", err);
      showToast("Unable to add item to cart", "error")
    } finally {
      setLoading(false);
    }
  };

  return { addToCart, openLogin, setOpenLogin, loading };
};
