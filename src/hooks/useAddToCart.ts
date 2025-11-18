import { useState } from "react";
import { toast } from "react-toastify";
import { customerApi } from "../api/axios";

export const useAddToCart = () => {
  const [openLogin, setOpenLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const addToCart = async (product: any, productTypeOverride?: string) => {
    const user = localStorage.getItem("user");

    // 🔐 If not logged in → open login modal everywhere
    if (!user) {
      setOpenLogin(true);
      toast.info("Please login to add items to cart");
      return;
    }

    setLoading(true);
    try {
      await customerApi.post("carts/", {
        product_type: productTypeOverride || product.productType || product.type,
        product_id: product.id,
      });

      toast.success("Added to cart!");
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      console.error("Add To Cart Error:", err);
      toast.error("Unable to add item to cart");
    } finally {
      setLoading(false);
    }
  };

  return { addToCart, openLogin, setOpenLogin, loading };
};
