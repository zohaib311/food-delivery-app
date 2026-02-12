import { motion } from "framer-motion";
import { Star, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import popularItemsData from "./assets/links/popularitems";
import { useCart } from "../../hooks/CartContext";

export default function PopularItems() {
    const { addToCart } = useCart();
    const [items, setItems] = useState(popularItemsData);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8000/api/customer/getItems.php')
            .then((res) => res.json())
            .then((data) => {
                if (data && Array.isArray(data.items)) {
                    setItems(data.items);
                }
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="px-8 py-16 bg-white">
            <h3 className="text-3xl font-bold mb-10 text-center text-gray-800">
                Popular <span className="text-green-600">Items</span>
            </h3>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                {loading ? (
                    <div className="col-span-full text-center">Loading items...</div>
                ) : (
                    items.map((item) => (
                        <motion.div
                            key={item.id || item.name}
                            whileHover={{ scale: 1.03 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="bg-gray-50 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                        >
                            <img src={item.image || item.img} alt={item.name} className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-semibold text-lg text-gray-800">{item.name}</h4>
                                    <div className="flex items-center text-yellow-500 text-sm">
                                        <Star className="w-4 h-4 fill-yellow-500" />
                                        <span className="ml-1">{item.rating}</span>
                                    </div>
                                </div>
                                <p className="text-green-600 font-semibold text-lg mb-3">Rs. {item.price}</p>
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => addToCart(item)}
                                    className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-full font-medium transition"
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    Add to Cart
                                </motion.button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </section>
    );
}
