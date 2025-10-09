import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import offersLinks from "./links/offersLinks";


export default function OfferDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const offer = offersLinks[id];

    if (!offer)
        return (
            <div className="flex items-center justify-center h-screen text-gray-700 text-lg">
                Offer not found 😔
            </div>
        );

    return (
        <section className="bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-6 max-w-6xl">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 mb-8 text-green-600 hover:text-green-700 font-semibold transition"
                >
                    <ArrowLeft size={20} /> Back to Offers
                </button>

                {/* Offer Banner */}
                <motion.div
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative rounded-3xl overflow-hidden shadow-xl"
                >
                    <img
                        src={offer.img}
                        alt={offer.title}
                        className="w-full h-72 md:h-96 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

                    <div className="absolute bottom-8 left-8 text-white max-w-2xl">
                        <h1 className="text-3xl md:text-4xl font-bold drop-shadow-lg">
                            {offer.title}
                        </h1>
                        <p className="mt-3 text-gray-200 text-sm md:text-base leading-relaxed">
                            {offer.desc}
                        </p>
                    </div>
                </motion.div>

                {/* Restaurants */}
                <div className="mt-14">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        Available At 🍴
                    </h2>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                        {offer.restaurants.map((rest, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 200 }}
                                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition border border-gray-100 flex flex-col justify-between"
                            >
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                        {rest.name}
                                    </h3>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p>⭐ Rating: <span className="font-medium">{rest.rating}</span></p>
                                        <p>⏱ Delivery Time: {rest.time}</p>
                                        <p>🚚 Delivery: {rest.delivery}</p>
                                    </div>
                                </div>

                                <button className="mt-6 w-full bg-green-500 text-white py-2.5 rounded-full font-medium hover:bg-green-600 transition">
                                    Order from {rest.name}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
