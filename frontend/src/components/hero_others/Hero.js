import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <img
                src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1920&q=80"
                alt="Delicious Food Background"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="relative z-10 text-center text-white max-w-2xl px-6"
            >
                <h2 className="text-5xl md:text-6xl font-bold leading-tight drop-shadow-lg">
                    Fresh, Fast & Flavorful — Delivered <span className="text-green-400">to Your Door</span>
                </h2>

                <p className="mt-4 text-gray-200 text-lg">
                    Discover top-rated restaurants near you and enjoy delicious meals in minutes.
                </p>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-8 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg"
                >
                    Order Now
                </motion.button>
            </motion.div>

            {/* Floating Food Image (Optional Decorative) */}
            {/* <motion.img
                src="https://i.ibb.co/7bF7TfL/pizza-floating.png"
                alt="Pizza"
                className="absolute bottom-0 right-10 w-64 hidden md:block"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
            /> */}
        </section>
    );
}
