import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(isLogin ? "Logged in successfully!" : "Account created successfully!");
    };

    return (
        <section className="min-h-screen flex justify-center items-center bg-gradient-to-br from-green-50 via-white to-gray-100 px-6 py-10">
            <div className="flex flex-col md:flex-row items-center justify-center bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-5xl">
                {/* Left Image Section */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="hidden md:flex flex-1 justify-center items-center "
                >
                    <img
                        src="https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=900&q=80"
                        alt="Delicious Food"
                        className="rounded-3xl shadow-lg w-4/5 object-cover hover:scale-105 transition-transform duration-500"
                    />
                </motion.div>

                {/* Form Section */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex-1 p-10 md:p-14"
                >
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-bold text-gray-800">
                            {isLogin ? "Welcome Back 👋" : "Join Foodies 🍴"}
                        </h2>
                        <p className="text-gray-500 mt-3 text-base">
                            {isLogin
                                ? "Log in to order your favorite meals easily."
                                : "Sign up and start your delicious journey today!"}
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {isLogin ? (
                            <motion.form
                                key="login"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.4 }}
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Email</label>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Password</label>
                                    <input
                                        type="password"
                                        placeholder="Enter your password"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
                                        required
                                    />
                                </div>

                                <div className="flex justify-between items-center text-sm">
                                    <label className="text-gray-600">
                                        <input type="checkbox" className="mr-2" /> Remember me
                                    </label>
                                    <button
                                        type="button"
                                        className="text-green-600 hover:underline font-medium"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    type="submit"
                                    className="w-full bg-green-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-green-700 shadow-md transition-all duration-200"
                                >
                                    Login
                                </motion.button>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="signup"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.4 }}
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your full name"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Email</label>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Password</label>
                                    <input
                                        type="password"
                                        placeholder="Create a strong password"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
                                        required
                                    />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    type="submit"
                                    className="w-full bg-green-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-green-700 shadow-md transition-all duration-200"
                                >
                                    Sign Up
                                </motion.button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    <div className="text-center mt-8">
                        <p className="text-gray-600">
                            {isLogin ? "Don’t have an account?" : "Already a member?"}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-green-600 font-semibold ml-2 hover:underline"
                            >
                                {isLogin ? "Sign Up" : "Login"}
                            </button>
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
