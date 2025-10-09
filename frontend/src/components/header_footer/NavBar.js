import { ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
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
            <div className="flex items-center gap-6">

                <Link to="/cart">
                    <ShoppingBag className="text-gray-700 cursor-pointer" /></Link>
                <Link to="/login" className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700">
                    Login
                </Link>
            </div>
        </header>
    );
}
