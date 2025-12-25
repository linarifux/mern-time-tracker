import { motion } from "framer-motion";

export default function ClientsHeader({ count }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row justify-between items-end gap-4"
    >
      <div>
        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2 flex items-center gap-3">
          The Rolodex 📖
        </h2>
        <p className="text-gray-400">
          The people who pay the bills. Treat them well (mostly).
        </p>
      </div>

      <div className="bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-800 text-sm font-mono text-cyan-400">
        Count: {count} VIPs
      </div>
    </motion.div>
  );
}