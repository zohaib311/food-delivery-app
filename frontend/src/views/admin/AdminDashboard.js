import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ShoppingCart, BarChart3, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import AdminSidebar from './AdminSidebar';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const menuItems = [
        { icon: BarChart3, label: 'Dashboard', path: '/admin/dashboard', color: 'text-blue-500' },
        { icon: Users, label: 'Manage Users', path: '/admin/users', color: 'text-purple-500' },
        { icon: ShoppingCart, label: 'Manage Items', path: '/admin/items', color: 'text-orange-500' },
        { icon: ShoppingCart, label: 'Manage Orders', path: '/admin/orders', color: 'text-green-500' },

    ];

    const [stats, setStats] = useState({
        total_users: 0,
        total_items: 0
    });


    const fetchDashboardStats = async () => {
        try {
            const token = localStorage.getItem("authToken");

            const res = await fetch(
                "http://localhost:8000/api/admin/DashStats.php",
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            const data = await res.json();

            if (data.success) {
                setStats(data.data);
            }

        } catch (error) {
            console.error("Dashboard fetch error", error);
        }
    };

    useEffect(() => {
        fetchDashboardStats();

    }, []);


    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <AdminSidebar sidebarOpen={sidebarOpen} user={user} handleLogout={handleLogout} menuItems={menuItems} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <div className="bg-white shadow-sm border-b border-gray-200">
                    <div className="px-6 py-4 flex items-center justify-between">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                        <h2 className="text-xl font-bold text-gray-800">Admin Dashboard</h2>
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-auto p-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                    >
                        {/* Stats Cards */}
                        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Total Users {stats.total_users}</p>
                                    <p className="text-3xl font-bold text-gray-800 mt-2">—</p>
                                </div>
                                <Users className="w-12 h-12 text-blue-500 opacity-20" />
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Total Items {stats.total_items}</p>
                                    <p className="text-3xl font-bold text-gray-800 mt-2">—</p>
                                </div>
                                <ShoppingCart className="w-12 h-12 text-orange-500 opacity-20" />
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">System Status</p>
                                    <p className="text-3xl font-bold text-green-600 mt-2">Active</p>
                                </div>
                                <BarChart3 className="w-12 h-12 text-purple-500 opacity-20" />
                            </div>
                        </div>
                    </motion.div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Welcome to Admin Panel</h3>
                        <p className="text-gray-600">
                            Use the sidebar navigation to manage users and food items. You have full control over the platform's content and user management.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
