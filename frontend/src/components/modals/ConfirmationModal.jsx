import { motion } from "framer-motion";
import ModalBackdrop from "./ModalBackdrop";

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <ModalBackdrop onClose={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Danger Gradient Top Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-red-500 to-orange-500" />

        <div className="text-center">
          {/* Animated Icon */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <span className="text-3xl">⚠️</span>
          </motion.div>

          <h3 className="text-2xl font-bold text-white mb-2">
            {title || "Are you sure?"}
          </h3>
          
          <p className="text-gray-400 mb-8">
            {message || "This action cannot be undone. Are you absolutely sure you want to proceed?"}
          </p>

          <div className="flex gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-gray-800 text-gray-300 font-bold hover:bg-gray-700 transition-colors"
            >
              Cancel
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onConfirm}
              className="px-6 py-2.5 rounded-xl bg-linear-to-r from-red-600 to-orange-600 text-white font-bold shadow-lg shadow-red-900/20 hover:from-red-500 hover:to-orange-500"
            >
              Yes, Delete it
            </motion.button>
          </div>
        </div>
      </motion.div>
    </ModalBackdrop>
  );
}