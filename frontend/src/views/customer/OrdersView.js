import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, Truck, AlertCircle, MapPin, Phone, Package } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CustomerOrders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            setError(null);
            const token = localStorage.getItem('authToken');

            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch('http://localhost:8000/api/customer/placeOrders.php?action=list', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Failed to fetch orders');
            }

            setOrders(data.orders || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const cancelOrder = async (orderId) => {
        try {
            const token = localStorage.getItem('authToken');

            const response = await fetch(`http://localhost:8000/api/customer/placeOrders.php?action=update-status&id=${orderId}&status=cancelled`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Failed to cancel order');
            }

            // Update the order status in the local state
            setOrders(prev => prev.map(order =>
                order.id === orderId ? { ...order, order_status: 'cancelled' } : order
            ));

            setError(null);
            alert('Order cancelled successfully!');
        } catch (err) {
            setError(err.message);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'accepted':
            case 'preparing':
                return <Package className="w-5 h-5 text-blue-500" />;
            case 'on_the_way':
                return <Truck className="w-5 h-5 text-purple-500" />;
            case 'delivered':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'cancelled':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Clock className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'accepted':
            case 'preparing':
                return 'bg-blue-100 text-blue-800';
            case 'on_the_way':
                return 'bg-purple-100 text-purple-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatStatus = (status) => {
        return status.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const filteredOrders = filter === 'all' ? orders : orders.filter(order => order.order_status === filter);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">My Orders</h1>
                    <div className='flex justify-between items-right '>
                        <button onClick={fetchOrders}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 mx-2 py-2 rounded-lg font-semibold transition">Refresh</button>
                        <button
                            onClick={() => navigate('/home')}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition"
                        >
                            Order More Food
                        </button>
                    </div>
                </div>

                {/* Error Message */}
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

                {/* Filter Tabs */}
                <div className="bg-white rounded-xl shadow-md p-4 mb-8 flex gap-2 flex-wrap">
                    {['all', 'pending', 'accepted', 'preparing', 'on_the_way', 'delivered', 'cancelled'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg font-semibold transition ${filter === status
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {status === 'all' ? 'All Orders' : formatStatus(status)}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders found</h2>
                        <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start exploring our restaurants!</p>
                        <button
                            onClick={() => navigate('/home')}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition"
                        >
                            Browse Restaurants
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order, index) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-xl shadow-lg hover:shadow-xl overflow-hidden transition cursor-pointer"
                                onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                            >
                                {/* Main Order Card */}
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                                Order #{order.id}
                                            </h3>
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                <span>
                                                    <strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}
                                                </span>
                                                <span>
                                                    <strong>Total:</strong> <span className="text-orange-600 font-bold"> {parseFloat(order.total_amount).toFixed(2)}</span>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {getStatusIcon(order.order_status)}
                                            <span className={`px-4 py-2 rounded-full font-semibold text-sm ${getStatusColor(order.order_status)}`}>
                                                {formatStatus(order.order_status)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {selectedOrder?.id === order.id && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="border-t bg-gray-50 p-6"
                                    >
                                        {/* Order Items */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="mb-6 bg-white rounded-lg p-4 border border-gray-200">
                                                <h4 className="font-bold text-gray-800 mb-4">Order Items</h4>
                                                <div className="space-y-3">
                                                    {order.items && order.items.length > 0 ? (
                                                        order.items.map((item, idx) => (
                                                            <div key={idx} className="flex justify-between items-center py-2 border-b last:border-b-0">
                                                                <div className="flex-1">
                                                                    <p className="font-semibold text-gray-800">{item.name}</p>
                                                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="font-bold text-orange-600"> {parseFloat(item.price * item.quantity).toFixed(2)}</p>
                                                                    <p className="text-xs text-gray-500"> {parseFloat(item.price).toFixed(2)} each</p>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-gray-500 text-sm">No items in this order</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Payment Status */}
                                            <div className=" mb-6 bg-white rounded-lg p-4 border border-gray-200">
                                                <h4 className="font-bold text-gray-800 mb-3">Payment Status</h4>
                                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                                            {/* Delivery Details */}
                                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                <h4 className="font-bold text-gray-800 mb-3">Delivery Details</h4>
                                                <div className="space-y-2 text-sm text-gray-600">
                                                    <div className="flex gap-2">
                                                        <Phone className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                                        <span>{order.delivery_name} • {order.delivery_phone}</span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                                        <span>{order.delivery_address}, {order.delivery_city} • {order.delivery_zip}</span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                                        <span>Delivery Fee:  {parseFloat(order.delivery_fee).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Timeline */}
                                            <div className=" bg-white rounded-lg p-4 border border-gray-200">
                                                <h4 className="font-bold text-gray-800 mb-4">Order Status Timeline</h4>
                                                <div className="space-y-3 text-sm">
                                                    {['pending', 'accepted', 'preparing', 'on_the_way', 'delivered'].map((status, i) => (
                                                        <div key={status} className="flex items-center gap-3">
                                                            <div className={`w-3 h-3 rounded-full ${['pending', 'accepted', 'preparing', 'on_the_way', 'delivered'].indexOf(order.order_status) >= i
                                                                ? 'bg-green-500'
                                                                : 'bg-gray-300'
                                                                }`} />
                                                            <span className="text-gray-600 capitalize">{formatStatus(status)}</span>
                                                            {order.order_status === status && <span className="text-xs text-orange-600 font-bold ml-auto">Current</span>}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="mt-6 flex gap-3 pt-6 border-t flex-wrap">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate('/home');
                                                }}
                                                className="flex-1 min-w-[120px] border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-semibold py-2 rounded-lg transition"
                                            >
                                                Reorder
                                            </button>
                                            {order.order_status === 'delivered' && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        // Handle review action
                                                    }}
                                                    className="flex-1 min-w-[120px] bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition"
                                                >
                                                    Rate Order
                                                </button>
                                            )}
                                            {order.order_status !== 'delivered' && order.order_status !== 'cancelled' && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (window.confirm('Are you sure you want to cancel this order?')) {
                                                            cancelOrder(order.id);
                                                        }
                                                    }}
                                                    className="flex-1 min-w-[120px] border-2 border-red-500 text-red-500 hover:bg-red-50 font-semibold py-2 rounded-lg transition"
                                                >
                                                    Cancel Order
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
