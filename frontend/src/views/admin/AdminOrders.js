import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Search, Trash2, Plus, Users, ShoppingCart, BarChart3, Menu, X, MapPin, Phone, Mail, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-blue-100 text-blue-800',
    preparing: 'bg-blue-100 text-blue-800',
    on_the_way: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
};

export default function AdminOrders() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const menuItems = [
        { icon: BarChart3, label: 'Dashboard', path: '/admin/dashboard', color: 'text-blue-500' },
        { icon: Users, label: 'Manage Users', path: '/admin/users', color: 'text-purple-500' },
        { icon: ShoppingCart, label: 'Manage Items', path: '/admin/items', color: 'text-orange-500' },
        { icon: ShoppingCart, label: 'Manage Orders', path: '/admin/orders', color: 'text-green-500' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [expanded, setExpanded] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            let res = await fetch('http://localhost:8000/api/admin/getAllOrders.php?action=list', {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });
            if (res.status === 401 && token) {
                res = await fetch(`http://localhost:8000/api/admin/getAllOrders.php?action=list&token=${token}`);
            }
            const data = await res.json();
            if (data.success) setOrders(data.orders || []);
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('authToken');
            let res = await fetch(`http://localhost:8000/api/admin/getAllOrders.php?action=update-status&id=${id}&status=${status}`, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });
            if (res.status === 401 && token) {
                res = await fetch(`http://localhost:8000/api/admin/getAllOrders.php?action=update-status&id=${id}&status=${status}&token=${token}`);
            }
            const data = await res.json();
            if (data.success) {
                setOrders(prev => prev.map(o => o.id === id ? { ...o, order_status: status } : o));
            } else {
                alert(data.message || 'Failed');
            }
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Error updating status');
        }
    };

    const filtered = orders.filter(o => {
        const q = searchTerm.toLowerCase();
        return String(o.id).includes(q) || (o.delivery_name || o.user_name || '').toLowerCase().includes(q) || (o.order_status || '').toLowerCase().includes(q);
    });

    const statuses = ['pending', 'accepted', 'preparing', 'on_the_way', 'delivered', 'cancelled'];

    return (
        <div className="flex h-screen bg-gray-100">
            <AdminSidebar sidebarOpen={sidebarOpen} user={user} handleLogout={handleLogout} menuItems={menuItems} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="bg-white shadow-sm border-b border-gray-200">
                    <div className="px-6 py-4 flex items-center justify-between">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold text-gray-800">Manage Orders</h2>
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <button
                                onClick={() => navigate('/admin/dashboard')}
                                className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <h1 className="text-2xl font-bold text-gray-800">Manage Orders</h1>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="bg-white rounded-lg shadow-md p-2 flex items-center border border-gray-200">
                                <Search className="w-4 h-4 text-gray-400 mr-2" />
                                <input type="text" placeholder="Search orders by id, name or status..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="outline-none text-sm" />
                            </div>
                            <button onClick={fetchOrders} className="bg-blue-600 text-white px-4 py-2 rounded">Refresh</button>
                        </div>
                    </div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            <div className="col-span-full text-center text-gray-500 py-8">Loading orders...</div>
                        ) : filtered.length === 0 ? (
                            <div className="col-span-full text-center text-gray-500 py-8">No orders found</div>
                        ) : (
                            filtered.map((o) => (
                                <motion.div key={o.id} whileHover={{ y: -5 }} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-sm text-gray-600">Order #{o.id}</div>
                                                <div className="text-sm text-gray-500">•</div>
                                                <div className="text-sm text-gray-700">{o.delivery_name || o.user_name || '—'}</div>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">{o.created_at ? new Date(o.created_at).toLocaleString() : '—'}</div>
                                        </div>

                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS[o.order_status] || 'bg-gray-100 text-gray-800'}`}>{o.order_status.replace(/_/g, ' ')}</span>
                                            <div className="text-lg font-bold text-green-600">Rs. {parseFloat(o.total_amount).toFixed(2)}</div>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <div className="text-sm font-semibold mb-2">Items</div>
                                        {o.items && o.items.length > 0 ? (
                                            <ul className="space-y-1 text-sm text-gray-700">
                                                {o.items.map((it, i) => (
                                                    <li key={i} className="flex justify-between">
                                                        <div>{it.name} <b>x ({it.quantity}) </b></div>
                                                        <div>Rs. {(parseFloat(it.price) * it.quantity).toFixed(2)}</div>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="text-gray-500">No items</div>
                                        )}
                                    </div>

                                    <div className="mt-4 flex items-center gap-3">
                                        <select value={o.order_status} onChange={(e) => updateStatus(o.id, e.target.value)} className="border rounded px-2 py-1">
                                            {statuses.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                                        </select>
                                        <button onClick={() => setSelectedOrder(o)} className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">Details</button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </motion.div>

                    <p className="text-gray-600 text-sm mt-6">Total Orders: <span className="font-bold">{filtered.length}</span></p>
                </div>
            </div>

            {/* Details Modal */}
            {selectedOrder && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedOrder(null)}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6 max-h-96 overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
                            <button onClick={() => setSelectedOrder(null)} className="p-1 hover:bg-gray-100 rounded">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Order Info */}
                            <div className="space-y-3">
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <h3 className="text-sm font-bold text-gray-700 mb-2">Order Information</h3>
                                    <div className="space-y-2 text-sm text-gray-700">
                                        <div><span className="font-semibold">Order ID:</span> #{selectedOrder.id}</div>
                                        <div><span className="font-semibold">Status:</span> <span className={`px-2 py-1 rounded text-xs font-semibold ${STATUS_COLORS[selectedOrder.order_status] || 'bg-gray-100 text-gray-800'}`}>{selectedOrder.order_status.replace(/_/g, ' ')}</span></div>
                                        <div><span className="font-semibold">Total Amount:</span> Rs. {parseFloat(selectedOrder.total_amount).toFixed(2)}</div>
                                        <div><span className="font-semibold">Payment Status:</span> {selectedOrder.payment_status}</div>
                                        <div><span className="font-semibold">Payment Method:</span> {selectedOrder.payment_method}</div>
                                        <div><span className="font-semibold">Order Date:</span> {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : '—'}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Customer & Delivery Info */}
                            <div className="space-y-3">
                                <div className="bg-green-50 rounded-lg p-4">
                                    <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><Users className="w-4 h-4" /> Customer Information</h3>
                                    <div className="space-y-2 text-sm text-gray-700">
                                        <div><span className="font-semibold">Name:</span> {selectedOrder.delivery_name || selectedOrder.user_name || '—'}</div>
                                        <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-500" /><span className="font-semibold">Phone:</span> {selectedOrder.delivery_phone || '—'}</div>
                                        <div className="flex items-start gap-2"><MapPin className="w-4 h-4 text-gray-500 mt-0.5" /><div><span className="font-semibold">Address:</span> {selectedOrder.delivery_address || '—'}, {selectedOrder.delivery_city || '—'} {selectedOrder.delivery_zip || '—'}</div></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="mt-6 bg-gray-50 rounded-lg p-4">
                            <h3 className="text-sm font-bold text-gray-700 mb-3">Order Items</h3>
                            {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                <div className="space-y-2">
                                    {selectedOrder.items.map((it, i) => (
                                        <div key={i} className="flex justify-between items-center text-sm py-2 border-b border-gray-200">
                                            <div className="flex items-center gap-3 flex-1">
                                                <div>
                                                    <div className="font-semibold text-gray-800">{it.name}</div>
                                                    <div className="text-xs text-gray-500">Qty: {it.quantity}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold">Rs. {(parseFloat(it.price) * it.quantity).toFixed(2)}</div>
                                                <div className="text-xs text-gray-500">@ Rs. {parseFloat(it.price).toFixed(2)}</div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="border-t-2 border-gray-300 pt-2 mt-2 flex justify-between font-bold text-gray-800">
                                        <span>Total:</span>
                                        <span>Rs. {parseFloat(selectedOrder.total_amount).toFixed(2)}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-gray-500 text-sm">No items</div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
