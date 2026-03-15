import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // Load from local storage on mount (EXCLUDING FILES)
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                const parsed = JSON.parse(savedCart);
                // Validate items to prevent crashes from bad data
                const validItems = parsed.filter(item => item.product && item.product.images);
                setCartItems(validItems);
            } catch (e) {
                console.error("Failed to parse cart", e);
                localStorage.removeItem('cart');
            }
        }
    }, []);

    // Save to local storage whenever cart changes
    useEffect(() => {
        const cartToSave = cartItems.map(item => {
            // Create a clean copy of customization without the File object
            let cleanCustomization = item.customization;
            if (item.customization && item.customization.file) {
                const { file, ...restCust } = item.customization;
                cleanCustomization = restCust;
            }

            return {
                ...item,
                customization: cleanCustomization
            };
        });
        localStorage.setItem('cart', JSON.stringify(cartToSave));
    }, [cartItems]);

    const addToCart = (product, quantity, size, customization) => {
        setCartItems(prev => {
            // Check if same product+size exists (customization makes uniqueness hard, assuming unique for now if custom)
            // If has customization, always add as new
            const isCustomized = customization && (customization.text || customization.file);

            if (!isCustomized) {
                const existingIdx = prev.findIndex(item => item.product._id === product._id && item.size === size);
                if (existingIdx > -1) {
                    const newCart = [...prev];
                    newCart[existingIdx].quantity += quantity;
                    return newCart;
                }
            }

            return [...prev, {
                id: Date.now(), // Temp frontend ID
                product,
                quantity,
                size,
                customization, // Contains text and optional 'file' (File Object)
                // Helper for display
                previewImage: customization?.file ? URL.createObjectURL(customization.file) : null
            }];
        });
    };

    const removeFromCart = (tempId) => {
        setCartItems(prev => prev.filter(item => item.id !== tempId));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartTotal = cartItems.reduce((acc, item) => {
        const sizeObj = item.product.sizes.find(s => s.label === item.size);
        // Use size price if it exists and is greater than 0, otherwise use base price
        const price = (sizeObj && sizeObj.price > 0) ? sizeObj.price : item.product.price;
        return acc + (price * item.quantity);
    }, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
};
