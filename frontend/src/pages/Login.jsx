import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Logging in...");

  // Fun messages for the loading state
  const loadingMessages = [
    "Summoning the dashboard...",
    "Decrypting your brilliance...",
    "Checking if you're a robot...",
    "Brewing digital coffee...",
    "Aligning the stars...",
  ];

  // Rotate loading messages while waiting
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingText(
          loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
        );
      }, 800);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      await login(email, password);
      // Optional: Delay slightly so user sees the funny text
      setTimeout(() => navigate("/"), 500); 
    } catch (e) {
      setError(e?.response?.data?.message || "Computer says no. (Check creds)");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-800 relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            className="text-4xl mb-2 inline-block"
          >
            👋
          </motion.div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Welcome Back, Legend.
          </h2>
          <p className="text-gray-400 mt-2 text-sm">
            Time is money. Let's make some money.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-1">
            <label className="block text-gray-400 text-xs uppercase font-bold tracking-wider ml-1">
              Your Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
              placeholder="ceo@awesome-inc.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className="block text-gray-400 text-xs uppercase font-bold tracking-wider ml-1">
              Secret Code
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Error Message with Shake Animation */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: [0, -10, 10, -5, 5, 0] }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 500 }}
                className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm text-center font-medium"
              >
                ⚠️ {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold text-lg shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin text-xl">💫</span> {loadingText}
              </span>
            ) : (
              "🚀 Let Me In"
            )}
          </motion.button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">
            Fresh face around here?{" "}
            <Link
              to="/register"
              className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline decoration-2 underline-offset-4"
            >
              Start for Free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}