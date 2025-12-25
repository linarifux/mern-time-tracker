import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false); // Track success to show "Check Email" view
  const [loadingText, setLoadingText] = useState("Creating account...");

  // Funny loading messages
  const loadingMessages = [
    "Generating a cool ID...",
    "Convincing the server you're real...",
    "Polishing the dashboard...",
    "Adding sparkles to your profile...",
    "Finalizing world domination plans...",
  ];

  // Rotate loading messages
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
      await register(name, email, password);
      setSuccess(true);
      // Optional: Auto-redirect to login after 5 seconds if they don't click
      setTimeout(() => navigate("/login"), 5000);
    } catch (e) {
      setError(e?.response?.data?.message || "Registration failed. Try again?");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 relative overflow-hidden">
        {/* Success View */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-xl text-center relative z-10"
        >
          <div className="text-6xl mb-4 animate-bounce">📩</div>
          <h2 className="text-3xl font-bold text-white mb-2">Almost There!</h2>
          <p className="text-gray-400 mb-6 text-lg">
            We sent a verification link to <span className="text-cyan-400 font-bold">{email}</span>.
            <br/><br/>
            Check your inbox (and maybe spam) to activate your account and start getting paid.
          </p>
          <Link 
            to="/login" 
            className="inline-block w-full py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-cyan-400 font-bold border border-gray-700 transition-colors"
          >
            Go to Login
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-800 relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ rotate: 10 }}
            animate={{ rotate: 0 }}
            className="text-4xl mb-2 inline-block"
          >
            🚀
          </motion.div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Join the Club.
          </h2>
          <p className="text-gray-400 mt-2 text-sm">
            Stop tracking time on napkins. Level up.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Name Input */}
          <div className="space-y-1">
            <label className="block text-gray-400 text-xs uppercase font-bold tracking-wider ml-1">
              What should we call you?
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
              placeholder="Elon M... wait, no."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email Input */}
          <div className="space-y-1">
            <label className="block text-gray-400 text-xs uppercase font-bold tracking-wider ml-1">
              Your Digital Coordinates
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
              placeholder="you@future-billionaire.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className="block text-gray-400 text-xs uppercase font-bold tracking-wider ml-1">
              Top Secret Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
              placeholder="Something stronger than '123456'"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Error Message with Shake */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: [0, -10, 10, -5, 5, 0] }}
                exit={{ opacity: 0 }}
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
                <span className="animate-spin text-xl">⚙️</span> {loadingText}
              </span>
            ) : (
              "✨ Create My Empire"
            )}
          </motion.button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">
            Already a legend?{" "}
            <Link
              to="/login"
              className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline decoration-2 underline-offset-4"
            >
              Log in here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}