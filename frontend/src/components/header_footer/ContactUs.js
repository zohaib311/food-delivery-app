import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Contact() {
    const [showThankYou, setShowThankYou] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowThankYou(true);
        e.target.reset();

        // Auto-close popup after 3 seconds
        setTimeout(() => setShowThankYou(false), 3000);
    };

    return (
        <section className="px-6 md:px-12 py-16 bg-gray-50 min-h-screen flex flex-col justify-center items-center relative">
            {/* Heading */}
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-800 mb-2">
                    Get in <span className="text-green-600">Touch</span>
                </h2>
                <p className="text-gray-600 max-w-lg mx-auto">
                    Have a question, feedback, or just want to say hello? We'd love to hear from you.
                </p>
            </div>

            {/* Contact Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-2xl shadow-lg p-8 w-full max-w-5xl">
                {/* Contact Info */}
                <div className="flex flex-col justify-center space-y-6">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                        Contact Information
                    </h3>

                    <p className="text-gray-600 leading-relaxed">
                        📍 123 Food Street, Lahore, Pakistan <br />
                        📞 +92 300 1234567 <br />
                        ✉️ <span className="text-green-600 font-medium">support@foodieshub.com</span>
                    </p>

                    <p className="text-gray-600">
                        We’re available Monday–Friday, 9AM–8PM.
                    </p>

                    <motion.img
                        src="https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=800&q=80"
                        alt="Contact Office"
                        className="rounded-xl shadow-md"
                        whileHover={{ scale: 1.03 }}
                    />
                </div>

                {/* Contact Form */}
                <motion.form
                    whileHover={{ scale: 1.01 }}
                    className="space-y-5"
                    onSubmit={handleSubmit}
                >
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Name</label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Message</label>
                        <textarea
                            placeholder="Write your message..."
                            rows="4"
                            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                            required
                        ></textarea>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        type="submit"
                        className="bg-green-600 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:bg-green-700 transition"
                    >
                        Send Message
                    </motion.button>
                </motion.form>
            </div>

            {/* ✅ Thank You Popup */}
            <AnimatePresence>
                {showThankYou && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            className="bg-white rounded-2xl shadow-xl p-8 max-w-sm text-center"
                        >
                            <h3 className="text-2xl font-semibold text-green-600 mb-2">
                                🎉 Thank You!
                            </h3>
                            <p className="text-gray-700 mb-4">
                                Your message has been sent successfully. <br />
                                We'll get back to you soon.
                            </p>
                            <button
                                onClick={() => setShowThankYou(false)}
                                className="bg-green-600 text-white px-5 py-2 rounded-full font-medium hover:bg-green-700 transition"
                            >
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
