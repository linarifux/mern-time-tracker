import { motion } from "framer-motion";
import ModalBackdrop from "./ModalBackdrop";

export default function AlertModal({ isOpen, onClose, title, message, type = "success" }) {
  if (!isOpen) return null;

  const isSuccess = type === "success";

  // Dynamic Styles
  const gradient = isSuccess 
    ? "from-green-500 to-emerald-500" 
    : "from-red-500 to-orange-500";
  
  const iconBg = isSuccess ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400";
  const buttonBg = isSuccess 
    ? "bg-gradient-to-r from-green-600 to-emerald-600 shadow-green-900/20" 
    : "bg-gray-800 border border-gray-700 hover:bg-gray-700";

  return (
    <ModalBackdrop onClose={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-sm shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gradient Line */}
        <div className={`absolute top-0 left-0 w-full h-1.5 bg-linear-to-r ${gradient}`} />

        <div className="text-center">
          {/* Icon */}
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${iconBg}`}>
            <span className="text-3xl">{isSuccess ? "🎉" : "⚠️"}</span>
          </div>

          <h3 className="text-2xl font-bold text-white mb-2">
            {title}
          </h3>
          
          <p className="text-gray-400 mb-8 leading-relaxed">
            {message}
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all ${buttonBg}`}
          >
            {isSuccess ? "Awesome!" : "Got it"}
          </motion.button>
        </div>
      </motion.div>
    </ModalBackdrop>
  );
}