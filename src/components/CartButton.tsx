import { useState } from "react";
import { ShoppingCart, Trash2, Loader2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastManager";

interface Props {
  productType: string;
  productId: number | string;
  compact?: boolean;
  onRequireLogin?: () => void;
}

const CartButton = ({
  productType,
  productId,
  compact = false,
  onRequireLogin = () => {},
}: Props) => {
  const pid = Number(productId);

  const { user, isInCart, addToCart, removeFromCart, getCartItemId } = useCart();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);

  const inCart = isInCart(productType, pid);
  const cartItemId = getCartItemId(productType, pid);

  const handleClick = async (e: any) => {
    e.stopPropagation();

    if (!user) {
      showToast("Please login to continue", "info");
      window.dispatchEvent(new Event("login-req"));
      onRequireLogin();
      return;
    }

    setLoading(true);

    try {
      if (inCart && cartItemId) {
        await removeFromCart(cartItemId);
        showToast("Removed from cart", "error");
        window.dispatchEvent(new Event("cart-updated"));
      } else {
        await addToCart(productType, pid);
        showToast("Added to cart", "success");
        window.dispatchEvent(new Event("cart-updated"));
      }
    } catch (err) {
    showToast("Something went wrong", "error");
      console.error(err);
    }

    setLoading(false);
  };

  //
  //  COMPACT BUTTON UI
  //
  if (compact) {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        className={`
          w-10 h-10 rounded-lg flex items-center justify-center
          transition-all active:scale-95
          ${inCart
            ? "bg-red-100 text-red-600 hover:bg-red-200"
            : "bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white"}
        `}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : inCart ? (
          <Trash2 className="w-4 h-4" />
        ) : (
          <ShoppingCart className="w-4 h-4" />
        )}
      </button>
    );
  }

  //
  //  FULL BUTTON UI
  //
  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`
        mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 
        rounded-lg font-medium transition-all active:scale-95

        ${inCart
          ? "bg-red-100 text-red-600 hover:bg-red-200"
          : "text-white bg-primary hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:shadow-md"}
      `}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : inCart ? (
        <>
          <Trash2 className="w-5 h-5" />
          Remove
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </>
      )}
    </button>
  );
};

export default CartButton;
