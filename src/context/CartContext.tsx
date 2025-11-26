import { createContext, useContext, useEffect, useState } from "react";
import { customerApi } from "../api/axios";

// ---------- TYPES ----------
type CartItem = {
  id: string | number;
  cart_id: string | number;
  product_type: string;
  product_id: string | number;
};

type CartContextType = {
  cart: CartItem[];
  user: any;
  addToCart: (productType: string, productId: number) => Promise<void>;
  removeFromCart: (cartItemId: string | number) => Promise<void>;
  isInCart: (productType: string, productId: number) => boolean;
  getCartItemId: (productType: string, productId: number) => string | number | null;
  fetchCart: () => Promise<void>;
};

// ---------- CONTEXT ----------
const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

  const fetchCart = async () => {
    if (!user) {
      setCart([]);
      return;
    }

    try {
      const res = await customerApi.get("carts/");
      const raw = res?.results || res || [];

      const flat: CartItem[] = [];

      raw.forEach((cartObj: any) => {
        (cartObj.items || []).forEach((it: any) => {
          flat.push({
            id: it.id,
            cart_id: cartObj.id,
            product_type: it.product_type,
            product_id: it.product_id,
          });
        });
      });

      setCart(flat);
    } catch (e) {
      console.error("Failed to load cart", e);
    }
  };

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  const addToCart = async (productType: string, productId: number) => {
    if (!user) return;
    await customerApi.post("carts/", { product_type: productType, product_id: productId });
    await fetchCart();
  };

  const removeFromCart = async (cartItemId: string | number) => {
    if (!user) return;
    await customerApi.delete(`carts/items/${cartItemId}/`);
    await fetchCart();
  };

  const isInCart = (productType: string, productId: number) =>
    cart.some(
      (x) =>
        x.product_type === productType &&
        String(x.product_id) === String(productId)
    );

  const getCartItemId = (productType: string, productId: number) => {
    const item = cart.find(
      (x) =>
        x.product_type === productType &&
        String(x.product_id) === String(productId)
    );
    return item?.id ?? null;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        user,
        addToCart,
        removeFromCart,
        isInCart,
        getCartItemId,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext)!;
