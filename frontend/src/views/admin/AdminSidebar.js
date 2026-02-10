import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminSidebar({ sidebarOpen, user, handleLogout, menuItems }) {
  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: sidebarOpen ? 0 : -250 }}
      className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 overflow-hidden`}
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold">FoodiesHub Admin</h1>
        <p className="text-gray-400 text-sm mt-1">Management Panel</p>
      </div>

      <nav className="mt-12">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center px-6 py-4 hover:bg-gray-700 transition-colors duration-200 group"
          >
            <item.icon className={`w-5 h-5 mr-3 ${item.color}`} />
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 w-40 p-6 border-t border-gray-700">
        <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4 mb-4">
          <p className="text-xs text-gray-300">Logged in as</p>
          <p className="text-sm font-semibold mt-1">{user.name}</p>
          <p className="text-xs text-gray-400 capitalize">{user.role}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>
    </motion.div>
  );
}
