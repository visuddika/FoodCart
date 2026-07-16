import React, { createContext, useState, useEffect, useContext } from "react";

const CartContext = createContext();

// Helper to safely convert a value to a number (or 0)
const safeParseFloat = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        try {
            const savedCart = localStorage.getItem("cart");
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, quantity = 1) => {
        const itemId = product.id || product._id; 

        setCart((prevCart) => {
            const existingItem = prevCart.find((ci) => ci.id === itemId);
            
            if (existingItem) {
                // If item exists, just update quantity
                return prevCart.map((ci) =>
                    ci.id === itemId
                        ? { ...ci, quantity: safeParseFloat(ci.quantity) + safeParseFloat(quantity) }
                        : ci
                );
            } else {
                // If new item, store all necessary details, ensuring price is a valid number
                return [
                    ...prevCart, 
                    { 
                        id: itemId, 
                        productId: itemId, 
                        name: product.name,
                        // ✅ CRITICAL FIX: Ensure price is saved as a number
                        price: safeParseFloat(product.price), 
                        image: product.image || product.imageUrl,
                        category: product.category, // Needed for grouping
                        quantity: safeParseFloat(quantity)
                    }
                ];
            }
        });
    };

    const removeFromCart = (itemId) => {
        setCart((prevCart) => prevCart.filter((ci) => ci.id !== itemId));
    };

    const updateQuantity = (itemId, newQuantity) => {
        const quantity = safeParseFloat(newQuantity);
        if (quantity < 1) return;
        setCart((prevCart) =>
            prevCart.map((ci) =>
                ci.id === itemId ? { ...ci, quantity: quantity } : ci
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };
    
    // ✅ CRITICAL FIX: Use safeParseFloat when calculating total
    const getCartTotal = () =>
        cart.reduce((total, ci) => total + (safeParseFloat(ci.price) * safeParseFloat(ci.quantity)), 0);

    const cartCount = cart.reduce((count, ci) => count + safeParseFloat(ci.quantity), 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getCartTotal,
                cartCount
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};