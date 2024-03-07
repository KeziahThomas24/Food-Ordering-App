"use client"
import { SessionProvider } from "next-auth/react";
import { createContext, useEffect, useState, ReactNode } from "react";
import toast from "react-hot-toast";

type CartProduct = {
  _id: string;
  name: string;
  image: string;
  basePrice: number;
  size?: { _id: string; name: string, price: number } | null;
  extras?: { _id: string; name: string, price: number }[];
};

type CartContextType = {
  cartProducts: CartProduct[];
  setCartProducts: React.Dispatch<React.SetStateAction<CartProduct[]>>;
  addToCart: (product: CartProduct, size: { _id: string; name: string; price: number } | null, extras: { _id: string; name: string; price: number }[]) => void;
  removeCartProduct: (event: React.MouseEvent<HTMLButtonElement>, indexToRemove: string) => void;
  clearCart: () => void;
};

export const CartContext = createContext<CartContextType>({
  cartProducts: [],
  setCartProducts: () => {},
  addToCart: () => {},
  removeCartProduct: () => {},
  clearCart: () => {},
});

export function cartProductPrice(cartProduct: CartProduct): number {
  let price = cartProduct.basePrice;
  if (cartProduct.size) {
    price += cartProduct.size.price;
  }
  if (cartProduct.extras && cartProduct.extras.length > 0) {
    for (const extra of cartProduct.extras) {
      price += extra.price;
    }
  }
  return price;
}

type AppProviderProps = {
  children: ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);

  const ls = typeof window !== "undefined" ? window.localStorage : null;

  useEffect(() => {
    if (ls && ls.getItem("cart")) {
      setCartProducts(JSON.parse(ls.getItem("cart") || "[]"));
    }
  }, []);

  function clearCart() {
    setCartProducts([]);
    saveCartProductsToLocalStorage([]);
  }

  function removeCartProduct(event: React.MouseEvent<HTMLButtonElement>, indexToRemove: string) {
    setCartProducts((prevCartProducts) => {
      const newCartProducts = prevCartProducts.filter(product => product._id !== indexToRemove);
      saveCartProductsToLocalStorage(newCartProducts);
      return newCartProducts;
    });
    toast.success("Product removed");
  }

  function saveCartProductsToLocalStorage(cartProducts: CartProduct[]) {
    if (ls) {
      ls.setItem("cart", JSON.stringify(cartProducts));
    }
  }

  function addToCart(product: CartProduct, size: { _id: string; name: string; price: number } | null, extras: { _id: string; name: string; price: number }[]) {
    setCartProducts((prevProducts) => {
      const cartProduct = { ...product, size, extras };
      const newProducts = [...prevProducts, cartProduct];
      saveCartProductsToLocalStorage(newProducts);
      return newProducts;
    });
  }

  return (
    <SessionProvider>
      <CartContext.Provider value={{ cartProducts, setCartProducts, addToCart, removeCartProduct, clearCart }}>
        {children}
      </CartContext.Provider>
    </SessionProvider>
  );
}
