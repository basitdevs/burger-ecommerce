"use client";

import { useEffect, useState } from "react";

export interface CartItem {
    id: number;
    Title: string;
    price: number;
    image: string;
    qty: number;
}

export const useCart = () => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [cartQty, setCartQty] = useState(0);

    // Load cart from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("cart");
        if (saved) {
            const parsed = JSON.parse(saved);
            setCart(parsed);
            setCartQty(parsed.reduce((sum: number, item: CartItem) => sum + item.qty, 0));
        }
    }, []);

    // Update localStorage + cartQty whenever cart changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
        setCartQty(cart.reduce((sum, item) => sum + item.qty, 0));
    }, [cart]);

    // Add To Cart
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

    return {
        cart,
        cartQty,
        addToCart,
    };
};
