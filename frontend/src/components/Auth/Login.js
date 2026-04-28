import { useState } from "react";
import { Undo2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { apiUrl } from "../../config/api";

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("customer");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const api = (path) => apiUrl(`/api/auth.php?action=${path}`);

    const doLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(api('login'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message || 'Login failed');
            localStorage.setItem('authToken', json.token);
            localStorage.setItem('user', JSON.stringify(json.user));

            // Role-based redirect
            if (json.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (json.user.role === 'restaurant') {
                navigate('/restaurant/dashboard');
            } else {
                // Customer
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message);
        } finally { setLoading(false); }
    };

    const doRegister = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(api('register'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, password, role })
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message || 'Register failed');
            // auto login after register
            await doLogin();
        } catch (err) {
            setError(err.message);
        } finally { setLoading(false); }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) doLogin(); else doRegister();
    };

    return (
        <section className="min-h-screen flex justify-center items-center bg-gradient-to-br from-green-50 via-white to-gray-100 px-6 py-10">
            <div className="flex flex-col md:flex-row items-center justify-center bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-5xl">
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

                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex-1 p-10 md:p-14"
                >
                    <Link to="/">
                        <Undo2 className="text-gray-700 cursor-pointer hover:text-green-600 transition" />
                    </Link>

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
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
                                        required
                                    />
                                </div>

                                {error && <div className="text-red-600">{error}</div>}

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-green-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-green-700 shadow-md transition-all duration-200"
                                >
                                    {loading ? 'Please wait...' : 'Login'}
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
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your full name"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Enter your phone number"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Create a strong password"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-3">Select Role</label>
                                    <div className="space-y-2">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="role"
                                                value="customer"
                                                checked={role === "customer"}
                                                onChange={(e) => setRole(e.target.value)}
                                                className="mr-2 accent-green-500"
                                            />
                                            <span className="text-gray-700">Customer</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="role"
                                                value="restaurant"
                                                checked={role === "restaurant"}
                                                onChange={(e) => setRole(e.target.value)}
                                                className="mr-2 accent-green-500"
                                            />
                                            <span className="text-gray-700">Restaurant</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="role"
                                                value="admin"
                                                checked={role === "admin"}
                                                onChange={(e) => setRole(e.target.value)}
                                                className="mr-2 accent-green-500"
                                            />
                                            <span className="text-gray-700">Admin</span>
                                        </label>
                                    </div>
                                </div>

                                {error && <div className="text-red-600">{error}</div>}

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-green-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-green-700 shadow-md transition-all duration-200"
                                >
                                    {loading ? 'Please wait...' : 'Sign Up'}
                                </motion.button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    <div className="text-center mt-8">
                        <p className="text-gray-600">
                            {isLogin ? "Don’t have an account?" : "Already a member?"}
                            <button
                                onClick={() => { setIsLogin(!isLogin); setError(null); }}
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
