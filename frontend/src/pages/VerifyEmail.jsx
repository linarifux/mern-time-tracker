import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("verifying"); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        await api.post("/auth/verify-email", { token });
        setStatus("success");
      } catch (error) {
        setStatus("error");
        setMessage(error.response?.data?.message || "Verification failed");
      }
    };
    if (token) verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
        {status === "verifying" && (
          <>
            <div className="text-4xl animate-bounce mb-4">⏳</div>
            <h2 className="text-xl font-bold text-white">Verifying...</h2>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
            <p className="text-gray-400 mb-6">Your account is now active.</p>
            <Link
              to="/login"
              className="inline-block bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Login Now
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-4xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-red-500 mb-2">Verification Failed</h2>
            <p className="text-gray-400 mb-6">{message}</p>
            <Link to="/login" className="text-cyan-400 hover:underline">
              Return to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}