import { useCart } from "../../../hooks/CartContext";
import { motion } from "framer-motion";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
    const { cart, setCart, removeFromCart } = useCart();
    const navigate = useNavigate();

    // Increase quantity
    const increaseQty = (name) => {
        setCart((prev) =>
            prev.map((item) =>
                item.name === name ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    // Decrease quantity
    const decreaseQty = (name) => {
        setCart((prev) =>
            prev
                .map((item) =>
                    item.name === name
                        ? { ...item, quantity: Math.max(1, item.quantity - 1) }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    // Calculate total
    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    if (cart.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center h-screen text-gray-600">
                <ShoppingBag size={60} className="text-green-500 mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-6">Add something delicious to your cart!</p>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/")}
                    className="bg-green-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-600 transition"
                >
                    Browse Items
                </motion.button>
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
                Your <span className="text-green-600">Cart</span>
            </h2>

            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6">
                {cart.map((item) => (
                    <motion.div
                        key={item.name}
                        whileHover={{ scale: 1.01 }}
                        className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-100 py-4"
                    >
                        {/* Item Info */}
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <img
                                src={item.image || item.img}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-lg shadow-sm"
                            />
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800">
                                    {item.name}
                                </h4>
                                <p className="text-green-600 font-medium">Rs. {item.price}</p>
                            </div>
                        </div>

                        {/* Quantity & Remove */}
                        <div className="flex items-center gap-4 mt-4 sm:mt-0">
                            <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                                <button
                                    onClick={() => decreaseQty(item.name)}
                                    className="p-1 text-gray-700 hover:text-green-600"
                                >
                                    <Minus size={18} />
                                </button>
                                <span className="mx-3 text-gray-800 font-medium">
                                    {item.quantity}
                                </span>
                                <button
                                    onClick={() => increaseQty(item.name)}
                                    className="p-1 text-gray-700 hover:text-green-600"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>

                            <button
                                onClick={() => removeFromCart(item.name)}
                                className="text-red-500 hover:text-red-600"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </motion.div>
                ))}

                {/* Total Section */}
                <div className="flex flex-col sm:flex-row justify-between items-center mt-8">
                    <h3 className="text-xl font-semibold text-gray-800">
                        Total: <span className="text-green-600">Rs. {total.toFixed(2)}</span>
                    </h3>
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        className="mt-4 sm:mt-0 bg-green-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-600 transition"
                        onClick={() => {
                            const token = localStorage.getItem('authToken');
                            if (!token) {
                                alert('Please login to proceed with checkout');
                                navigate("/login");
                            } else {
                                navigate("/checkout");
                            }
                        }}
                    >
                        Proceed to Checkout
                    </motion.button>
                </div>
            </div>
        </section>
    );
}
