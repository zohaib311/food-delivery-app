import { ShoppingBag, LogOut, Settings, Package } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <header className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
            <div
                onClick={() => navigate("/")}
                className="text-2xl font-bold text-green-600 cursor-pointer"
            >
                Foodies<span className="text-gray-800">Hub</span>
            </div>
            {/* Links */}
            <ul className="hidden md:flex items-center gap-8 font-medium text-gray-700">
                <li>
                    <Link to="/" className="hover:text-green-600 transition">
                        Home
                    </Link>
                </li>
                <li>
                    <Link to="/categories" className="hover:text-green-600 transition">
                        Categories
                    </Link>
                </li>
                <li>
                    <Link to="/restaurants" className="hover:text-green-600 transition">
                        Restaurants
                    </Link>
                </li>
                <li>
                    <Link to="/offers" className="hover:text-green-600 transition">
                        Offers
                    </Link>
                </li>
                <li>
                    <Link to="/contact" className="hover:text-green-600 transition">
                        Contact
                    </Link>
                </li>
            </ul>
            <div className="flex items-center gap-6 relative">
                {token && user ? (
                    <>
                        {user.role === 'admin' && (
                            <Link to="/admin/dashboard" className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition">
                                <Settings className="w-4 h-4" />
                                Dashboard
                            </Link>
                        )}
                        {user.role === 'customer' && (
                            <Link to="/orders" className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition">
                                <Package className="w-4 h-4" />
                                My Orders
                            </Link>
                        )}
                        <Link to="/cart">
                            <ShoppingBag className="text-gray-700 cursor-pointer hover:text-green-600 transition" /></Link>

                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer"
                        >
                            {user.name?.charAt(0).toUpperCase()}
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 top-12 bg-white shadow-lg rounded-lg py-2 w-48 z-10">
                                <div className="px-4 py-2 border-b border-gray-200">
                                    <p className="font-semibold text-sm text-gray-800">{user.name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition text-sm"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <Link to="/cart">
                            <ShoppingBag className="text-gray-700 cursor-pointer hover:text-green-600 transition" /></Link>
                        <Link to="/login" className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700">
                            Login
                        </Link>
                    </>
                )}
            </div>
        </header >
    );
}
