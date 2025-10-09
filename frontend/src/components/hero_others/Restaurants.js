import { motion } from "framer-motion";
import restaurantsData from "./assets/links/restaurants";

export default function Restaurants() {
    return (
        <section className="px-8 py-16 bg-gray-50">
            <h3 className="text-3xl font-bold mb-10 text-center text-gray-800">
                Discover Popular <span className="text-green-600">Restaurants Near You</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {restaurantsData.map((res) => (
                    <motion.div
                        key={res.name}
                        whileHover={{ scale: 1.03 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="bg-white rounded-3xl overflow-hidden shadow-lg cursor-pointer flex flex-col"
                    >
                        <div className="relative overflow-hidden">
                            <img
                                src={res.img}
                                alt={res.name}
                                className="w-full h-52 object-cover transition-transform duration-500 hover:scale-105"
                            />
                            <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
                                ⭐ {res.rating}
                            </div>
                        </div>
                        <div className="p-6 flex-grow flex flex-col justify-between">
                            <div>
                                <h4 className="text-xl font-semibold text-gray-800">{res.name}</h4>
                                <p className="mt-1 text-gray-500">{res.cuisine}</p>
                            </div>
                            <button
                                className="mt-4 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full font-medium w-full"
                            >
                                View Menu
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
