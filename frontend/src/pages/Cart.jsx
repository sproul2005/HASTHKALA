import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import api from '../services/api';

const Cart = () => {
    const { cartItems, removeFromCart, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [shippingAddress, setShippingAddress] = useState({
        fullName: user?.name || '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        phone: ''
    });

    const handleAddressChange = (e) => {
        setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
    };

    const handleCheckout = async () => {
        if (cartItems.length === 0) return;

        // Validate Address
        const { fullName, address, city, state, pincode, phone } = shippingAddress;
        if (!fullName || !address || !city || !state || !pincode || !phone) {
            alert("Please fill in all shipping address details.");
            return;
        }

        setLoading(true);

        try {
            // 1. Process items and Upload Images
            const orderItems = await Promise.all(cartItems.map(async (item) => {
                let customImageUrl = null;

                // If there is a file, upload it first
                if (item.customization && item.customization.file) {
                    const formData = new FormData();
                    formData.append('image', item.customization.file);

                    try {
                        const uploadRes = await api.post('/upload', formData, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                        });
                        customImageUrl = uploadRes.data.url;
                    } catch (err) {
                        console.error("Image upload failed for item", item.product.name, err);
                        throw new Error(`Failed to upload image for ${item.product.name}`);
                    }
                }

                
                const sizeObj = item.product.sizes.find(s => s.label === item.size);
                
                const calculatedPrice = (sizeObj && sizeObj.price > 0) ? sizeObj.price : item.product.price;

                
                return {
                    product: item.product._id,
                    name: item.product.name,
                    image: item.product.images[0]?.url || '',
                    price: calculatedPrice,
                    quantity: item.quantity,
                    size: item.size,
                    customization: {
                        text: item.customization?.text || '',
                        image: customImageUrl || '',
                        note: ''
                    }
                };
            }));

            // 2. Create Order
            const orderData = {
                orderItems,
                shippingAddress,
                paymentMethod: "Razorpay", // Default
                itemsPrice: cartTotal,
                taxPrice: 0,
                shippingPrice: 0,
                totalPrice: cartTotal
            };

            const { data } = await api.post('/orders/new', orderData);

            alert('Order Placed Successfully!');
            clearCart();
            navigate('/'); 

        } catch (error) {
            console.error("Checkout failed", error);
            const msg = error.response && error.response.data && error.response.data.error
                ? error.response.data.error
                : (error.message || 'Checkout Failed');
            alert(`Error: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="container section" style={{ textAlign: 'center' }}>
                <h2>Your Cart is Empty</h2>
                <Link to="/shop">
                    <button className="btn-primary" style={{ marginTop: '1rem' }}>Go Shopping</button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container section">
            <h1 style={{ marginBottom: '2rem' }}>Shopping Cart</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {}
                <div>
                    <h3 style={{ marginBottom: '1rem' }}>Cart Items</h3>
                    {cartItems.map((item) => {
                        const sizeObj = item.product.sizes.find(s => s.label === item.size);
                        
                        const price = (sizeObj && sizeObj.price > 0) ? sizeObj.price : item.product.price;

                        return (
                            <div key={item.id} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-accent)', paddingBottom: '1rem' }}>
                                <div style={{ width: '80px', height: '80px', background: '#f0f0f0' }}>
                                    {item.product.images[0] && <img src={item.product.images[0].url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4>{item.product.name}</h4>
                                    <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>Size: {item.size}</p>

                                    {}
                                    {item.customization && (item.customization.text || item.customization.file) && (
                                        <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', background: '#fafafa', padding: '5px' }}>
                                            {item.customization.text && <p>Note: {item.customization.text}</p>}
                                            {item.previewImage && (
                                                <div style={{ marginTop: '5px' }}>
                                                    <span>Attached Photo:</span>
                                                    <img src={item.previewImage} alt="Custom" style={{ width: '40px', height: '40px', objectFit: 'cover', display: 'block', marginTop: '2px' }} />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontWeight: 600 }}>₹{price}</p>
                                    <p>x {item.quantity}</p>
                                    <button onClick={() => removeFromCart(item.id)} style={{ color: 'red', background: 'none', border: 'none', marginTop: '0.5rem' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {}
                <div>
                    {}
                    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '1rem' }}>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Shipping Details</h3>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <input type="text" name="fullName" placeholder="Full Name" value={shippingAddress.fullName} onChange={handleAddressChange} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                            <input type="text" name="phone" placeholder="Phone Number" value={shippingAddress.phone} onChange={handleAddressChange} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                            <textarea name="address" placeholder="Address (House No, Street)" value={shippingAddress.address} onChange={handleAddressChange} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} rows="2"></textarea>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                <input type="text" name="city" placeholder="City" value={shippingAddress.city} onChange={handleAddressChange} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                                <input type="text" name="pincode" placeholder="Pincode" value={shippingAddress.pincode} onChange={handleAddressChange} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                            </div>
                            <input type="text" name="state" placeholder="State" value={shippingAddress.state} onChange={handleAddressChange} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                        </div>
                    </div>

                    {}
                    <div style={{ backgroundColor: 'var(--color-surface)', padding: '2rem', height: 'fit-content' }}>
                        <h3>Order Summary</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '1rem 0' }}>
                            <span>Subtotal</span>
                            <span>₹{cartTotal}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '1rem 0' }}>
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <hr style={{ borderColor: '#ddd' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '1rem 0', fontWeight: 600, fontSize: '1.2rem' }}>
                            <span>Total</span>
                            <span>₹{cartTotal}</span>
                        </div>

                        <button
                            className="btn-primary"
                            style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                            onClick={handleCheckout}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : <><ShoppingBag size={18} /> Place Order</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
