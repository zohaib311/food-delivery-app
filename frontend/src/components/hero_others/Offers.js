import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import offersData from "./assets/links/offers";


export default function Offers() {
    const navigate = useNavigate();

    return (
        <section className="px-8 py-16 bg-gray-50">
            <h3 className="text-3xl font-bold mb-10 text-center text-gray-800">
                Special <span className="text-green-600">Offers & Discounts</span>
            </h3>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
                Save big on your favorite meals! Grab these exclusive offers and enjoy delicious food delivered fast & fresh.
            </p>

            <div className="py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {offersData.map((offer, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="relative group rounded-2xl overflow-hidden shadow-md cursor-pointer"
                    >
                        {/* Background Image */}
                        <img
                            src={offer.img}
                            alt={offer.title}
                            className="w-full h-52 object-cover group-hover:brightness-75 transition-all duration-300"
                        />

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-all duration-300"></div>

                        {/* Offer Title */}
                        <h4 className="absolute bottom-14 left-0 right-0 text-center text-white text-xl font-semibold drop-shadow-lg">
                            {offer.title}
                        </h4>

                        {/* Offer Description */}
                        <p className="absolute bottom-4 left-4 right-4 text-center text-gray-200 text-sm opacity-90 hidden group-hover:block transition">
                            {offer.desc}
                        </p>

                        {/* Floating “Order Now” Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileHover={{ opacity: 1, y: 0 }}
                            className="absolute inset-0 flex justify-center items-center"
                        >
                            <button
                                onClick={() => navigate(`/offers/${i}`)}
                                className="bg-green-500 text-white px-5 py-2 rounded-full font-semibold shadow-lg hover:bg-green-600 transition"
                            >
                                Order Now
                            </button>
                        </motion.div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
