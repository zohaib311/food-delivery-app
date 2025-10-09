import { motion } from "framer-motion";
import CategoriesData from "./assets/links/categories";
import { useNavigate } from "react-router-dom";


export default function Categories() {
    const navigate = useNavigate();

    return (
        <section className="px-8 py-16 bg-gray-50">
            <h3 className="text-3xl font-bold mb-10 text-center text-gray-800">
                Explore Popular <span className="text-green-600">Categories</span>
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
                {CategoriesData.map((cat, i) => (
                    <motion.div
                        key={cat.name}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="relative group rounded-2xl overflow-hidden shadow-md cursor-pointer"
                        onClick={() => navigate(`/category/${cat.name.toLowerCase()}`)}
                    >
                        {/* Background Image */}
                        <img
                            src={cat.img}
                            alt={cat.name}
                            className="w-full h-44 md:h-52 object-cover group-hover:brightness-75 transition-all duration-300"
                        />

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-all duration-300"></div>

                        {/* Category Name */}
                        <h4 className="absolute bottom-4 left-0 right-0 text-center text-white text-xl font-semibold drop-shadow-lg">
                            {cat.name}
                        </h4>

                        {/* Floating Effect */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileHover={{ opacity: 1, y: 0 }}
                            className="absolute inset-0 flex justify-center items-center"
                        >
                            <button className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg hover:bg-green-600 transition">
                                View Items
                            </button>
                        </motion.div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
