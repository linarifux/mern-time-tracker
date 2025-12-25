import { motion } from "framer-motion";
import ModalBackdrop from "./ModalBackdrop";

export default function EditNoteModal({ isOpen, onClose, noteValue, setNoteValue, onSave }) {
  if (!isOpen) return null;

  return (
    <ModalBackdrop onClose={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-lg shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-cyan-500 to-blue-500 rounded-t-2xl" />

        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cyan-900/30 flex items-center justify-center text-cyan-400">📝</div>
          Edit Notes
        </h3>

        <textarea
          rows={5}
          value={noteValue}
          onChange={(e) => setNoteValue(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-gray-950/50 border border-gray-800 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all resize-none"
          placeholder="What did you work on?"
          autoFocus
        />

        <div className="mt-8 flex justify-end gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2.5 rounded-xl bg-gray-800 text-gray-300 font-semibold hover:bg-gray-700 transition-colors"
            onClick={onClose}
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2.5 rounded-xl bg-linear-to-r from-cyan-600 to-cyan-500 text-white font-bold shadow-lg shadow-cyan-900/20"
            onClick={onSave}
          >
            Save Changes
          </motion.button>
        </div>
      </motion.div>
    </ModalBackdrop>
  );
}