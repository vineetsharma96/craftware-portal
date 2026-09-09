'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types';
import { PRODUCTS, getProductById } from '@/data/products';

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    cart: CartItem[]; // Backward compatibility alias
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
    setIsOpen: (open: boolean) => void;
    addToCart: (product: Product, quantity?: number) => void;
    addItem: (productOrId: Product | string, quantity?: number) => void; // Universal alias
    removeFromCart: (productId: string) => void;
    removeItem: (productId: string) => void; // Backward compatibility alias
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalCount: number; // Backward compatibility alias
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        try {
            const saved = localStorage.getItem('craftware_cart');
            if (saved) {
                setItems(JSON.parse(saved));
            }
        } catch (e) {
            console.error('Failed to parse cart storage:', e);
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            try {
                localStorage.setItem('craftware_cart', JSON.stringify(items));
            } catch (e) {
                console.error('Failed to save cart storage:', e);
            }
        }
    }, [items, mounted]);

    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);
    const toggleCart = () => setIsOpen((prev) => !prev);

    const addToCart = (product: Product, quantity = 1) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.product.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { product, quantity }];
        });
        setIsOpen(true);
    };

    // Handles both addItem(productId, quantity) and addItem(productObject, quantity)
    const addItem = (productOrId: Product | string, quantity = 1) => {
        if (typeof productOrId === 'string') {
            const resolved = getProductById(productOrId) || PRODUCTS.find((p) => p.id === productOrId);
            if (resolved) {
                addToCart(resolved, quantity);
            } else {
                console.warn(`[CART] Product with ID "${productOrId}" not found in catalog.`);
            }
        } else {
            addToCart(productOrId, quantity);
        }
    };

    const removeFromCart = (productId: string) => {
        setItems((prev) => prev.filter((item) => item.product.id !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setItems((prev) =>
            prev.map((item) =>
                item.product.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => setItems([]);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                items,
                cart: items,
                isOpen,
                openCart,
                closeCart,
                toggleCart,
                setIsOpen,
                addToCart,
                addItem,
                removeFromCart,
                removeItem: removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                totalCount: totalItems,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}