import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (e) {
      setError(e?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      {" "}
      <div className="w-full max-w-md bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-800">
        {" "}
        <h2 className="text-2xl font-bold text-center text-cyan-400 mb-6">
          Login to Your Account
        </h2>{" "}
        <form onSubmit={onSubmit} className="space-y-5">
          {" "}
          <div>
            {" "}
            <label className="block text-gray-300 text-sm mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />{" "}
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-semibold transition-colors disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-gray-400 text-sm text-center mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-cyan-400 hover:text-cyan-300 font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
