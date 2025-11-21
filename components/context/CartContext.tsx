"use client";

import { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
    id: number;
    Title: string;
    price: number;
    image: string;
    qty: number;
}

interface CartContextType {
    cart: CartItem[];
    cartQty: number;
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: number) => void;
    updateCartItem: (id: number, qty: number) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    // Load cart from localStorage on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("cart");
            if (saved) setCart(JSON.parse(saved));
        }
    }, []);

    // Update localStorage whenever cart changes
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    }, [cart]);

    const addToCart = (item: CartItem) => {
        setCart((prev) => {
            const exists = prev.find((p) => p.id === item.id);
            if (exists) {
                return prev.map((p) =>
                    p.id === item.id ? { ...p, qty: p.qty + 1 } : p
                );
            }
            return [...prev, { ...item, qty: 1 }];
        });
    };

    const removeFromCart = (id: number) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    const updateCartItem = (id: number, qty: number) => {
        setCart((prev) =>
            prev.map((item) => (item.id === id ? { ...item, qty } : item))
        );
    };

    const cartQty = cart.reduce((sum, item) => sum + item.qty, 0);

    return (
        <CartContext.Provider
            value={{ cart, cartQty, addToCart, removeFromCart, updateCartItem }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext)!;
