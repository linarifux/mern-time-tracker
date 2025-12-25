import { motion } from "framer-motion";
import ModalBackdrop from "./ModalBackdrop";

export default function ManualEntryModal({ isOpen, onClose, clients, form, setForm, onSubmit }) {
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
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-purple-500 to-pink-500 rounded-t-2xl" />

        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center text-purple-400">⏱️</div>
          Log Manual Time
        </h3>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Client Select */}
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase mb-1 ml-1">Client</label>
            <select
              className="w-full px-4 py-3 rounded-xl bg-gray-950/50 border border-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
              value={form.clientId}
              onChange={(e) => setForm({ ...form, clientId: e.target.value })}
              required
            >
              <option value="">Select a Client</option>
              {clients.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Date & Hours */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-1 ml-1">Date</label>
              <input
                type="date"
                className="w-full px-4 py-3 rounded-xl bg-gray-950/50 border border-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-1 ml-1">Hours</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                placeholder="1.5"
                className="w-full px-4 py-3 rounded-xl bg-gray-950/50 border border-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                value={form.hours}
                onChange={(e) => setForm({ ...form, hours: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Tag & Notes */}
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase mb-1 ml-1">Project / Tag</label>
            <input
              type="text"
              placeholder="e.g. Redesign"
              className="w-full px-4 py-3 rounded-xl bg-gray-950/50 border border-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
              value={form.tag}
              onChange={(e) => setForm({ ...form, tag: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase mb-1 ml-1">Notes</label>
            <textarea
              rows={3}
              placeholder="Details..."
              className="w-full px-4 py-3 rounded-xl bg-gray-950/50 border border-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all resize-none"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              className="px-5 py-2.5 rounded-xl bg-gray-800 text-gray-300 font-semibold hover:bg-gray-700 transition-colors"
              onClick={onClose}
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg shadow-purple-900/20"
            >
              Add Entry
            </motion.button>
          </div>
        </form>
      </motion.div>
    </ModalBackdrop>
  );
}