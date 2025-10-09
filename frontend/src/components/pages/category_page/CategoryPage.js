import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";


export default function CategoryPage() {
    const { name } = useParams();

    const fakeItems = [
        { title: `Special ${name} `, img: "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=800&q=80", price: "Rs. 499" },
        { title: `Cheese ${name} `, img: "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=800&q=80", price: "Rs. 699" },
        { title: `Patty ${name} `, img: "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=800&q=80", price: "Rs. 299" },
        { title: `Deluxe ${name} `, img: "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=800&q=80", price: "Rs. 599" },
        { title: `Family Pack ${name} `, img: "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=800&q=80", price: "Rs. 999" },
    ];


    return (
        <section className="px-8 py-16 bg-gray-50 min-h-screen">
            <h2 className="text-4xl font-bold mb-10 text-center capitalize">
                {name} <span className="text-green-600" >Menu</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {fakeItems.map((item, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ scale: 1.03 }}
                        className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition"
                    >
                        <img src={item.img} alt={item.title} className="h-52 w-full object-cover" />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold">{item.title}</h3>
                            <p className="text-green-600 font-bold mt-2">{item.price}</p>
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                className=" mt-4 w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-full font-medium transition"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                Add to Cart
                            </motion.button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
