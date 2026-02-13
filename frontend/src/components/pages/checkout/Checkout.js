import React, { useState, useEffect } from 'react';
import { useCart } from '../../../hooks/CartContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Checkout() {
    const { cart, setCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Check authentication on mount
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        zipCode: '',
        deliveryInstructions: '',
        paymentMethod: 'cod'
    });

    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const calculateTotals = () => {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryFee = cart.length > 0 ? 50 : 0;
        const tax = subtotal * 0.04;
        const total = subtotal + deliveryFee + tax;
        return { subtotal, deliveryFee, tax, total };
    };

    const { subtotal, deliveryFee, tax, total } = calculateTotals();

    const validateForm = () => {
        if (!formData.fullName.trim()) {
            setError('Full name is required');
            return false;
        }
        if (!formData.phone.trim() || formData.phone.length < 10) {
            setError('Valid phone number is required');
            return false;
        }
        if (!formData.address.trim()) {
            setError('Address is required');
            return false;
        }
        if (!formData.city.trim()) {
            setError('City is required');
            return false;
        }
        if (!formData.zipCode.trim()) {
            setError('Zip code is required');
            return false;
        }
        return true;
    };

    const handlePlaceOrder = async () => {
        setError(null);

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/login');
                return;
            }

            // Prepare order items
            const items = cart.map(item => ({
                id: item.id || 1,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            }));

            const response = await fetch('http://localhost:8000/api/customer/placeOrders.php?action=create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    items: items,
                    delivery_fee: deliveryFee,
                    delivery_name: formData.fullName,
                    delivery_phone: formData.phone,
                    delivery_address: formData.address,
                    delivery_city: formData.city,
                    delivery_zip: formData.zipCode,
                    payment_method: formData.paymentMethod,
                    payment_meta: { delivery_instructions: formData.deliveryInstructions }
                })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Failed to place order');
            }

            // Clear cart
            setCart([]);

            // Show confirmation
            setShowConfirmation(true);

            // Redirect to orders after 3 seconds
            setTimeout(() => {
                navigate('/orders', { state: { orderId: data.order.id } });
            }, 3000);

        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <button
                        onClick={() => navigate('/cart')}
                        className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold mb-6"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Cart
                    </button>
                    <div className="text-center py-20 bg-white rounded-xl shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
                        <p className="text-gray-600 mb-6">Add items before checkout</p>
                        <button
                            onClick={() => navigate('/home')}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (showConfirmation) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center py-12">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <span className="text-4xl">✓</span>
                    </motion.div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Order Placed!</h2>
                    <p className="text-gray-600 mb-4">Your order has been confirmed and sent to the restaurant.</p>
                    <p className="text-sm text-gray-500 mb-6">Total: <span className="font-bold text-orange-600">₹{total.toFixed(2)}</span></p>
                    <p className="text-gray-500 text-sm">Redirecting to your orders...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <button
                    onClick={() => navigate('/cart')}
                    className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold mb-8"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Cart
                </button>

                <h1 className="text-4xl font-bold text-gray-800 mb-8">Checkout</h1>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex gap-3"
                    >
                        <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                        <p className="text-red-700">{error}</p>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
                            {/* Delivery Address */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <MapPin className="w-6 h-6 text-orange-500" />
                                    Delivery Address
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="fullName"
                                        placeholder="Full Name"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className="col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Phone Number"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="Street Address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="City"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                    <input
                                        type="text"
                                        name="zipCode"
                                        placeholder="Zip Code"
                                        value={formData.zipCode}
                                        onChange={handleInputChange}
                                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                    <textarea
                                        name="deliveryInstructions"
                                        placeholder="Delivery Instructions (Optional)"
                                        value={formData.deliveryInstructions}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                    />
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <CreditCard className="w-6 h-6 text-orange-500" />
                                    Payment Method
                                </h2>
                                <div className="space-y-3">
                                    <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 transition" style={{ borderColor: formData.paymentMethod === 'cod' ? '#f97316' : undefined }}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={formData.paymentMethod === 'cod'}
                                            onChange={handleInputChange}
                                            className="w-4 h-4"
                                        />
                                        <span className="ml-3 font-semibold text-gray-800">Cash on Delivery</span>
                                    </label>
                                    <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 transition" style={{ borderColor: formData.paymentMethod === 'card' ? '#f97316' : undefined }}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="card"
                                            checked={formData.paymentMethod === 'card'}
                                            onChange={handleInputChange}
                                            className="w-4 h-4"
                                        />
                                        <span className="ml-3 font-semibold text-gray-800">Credit/Debit Card</span>
                                    </label>
                                    <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 transition" style={{ borderColor: formData.paymentMethod === 'upi' ? '#f97316' : undefined }}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="upi"
                                            checked={formData.paymentMethod === 'upi'}
                                            onChange={handleInputChange}
                                            className="w-4 h-4"
                                        />
                                        <span className="ml-3 font-semibold text-gray-800">UPI</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <div className="bg-white rounded-xl shadow-lg p-8 sticky top-20">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

                            {/* Items */}
                            <div className="mb-4 max-h-64 overflow-y-auto border-b pb-4">
                                {cart.map((item, index) => (
                                    <div key={index} className="flex justify-between text-sm text-gray-600 mb-3">
                                        <span>{item.name} × {item.quantity}</span>
                                        <span className="font-semibold">{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="space-y-3 pb-4 border-b">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-semibold">{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Fee</span>
                                    <span className="font-semibold">{deliveryFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax (4%)</span>
                                    <span className="font-semibold">{tax.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between mt-6 mb-6">
                                <span className="text-lg font-bold text-gray-800">Total</span>
                                <span className="text-2xl font-bold text-orange-600"><span className='text-sm disabled'>R.s</span> {total.toFixed(2)}</span>
                            </div>

                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={handlePlaceOrder}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition"
                            >
                                {loading ? 'Processing...' : 'Place Order'}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
