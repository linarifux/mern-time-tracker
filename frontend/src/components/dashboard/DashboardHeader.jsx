import { motion } from "framer-motion";

export default function DashboardHeader({ greeting, onOpenManualLog }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
      <div>
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-extrabold tracking-tight text-white"
        >
          {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Creator.</span>
        </motion.h1>
        <p className="text-gray-400 mt-1">Ready to be productive?</p>
      </div>

      <motion.button
        whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(6,182,212,0.3)" }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpenManualLog}
        className="px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 hover:border-cyan-500 text-cyan-400 font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all"
      >
        <span className="text-xl">+</span> Log Manual Time
      </motion.button>
    </div>
  );
}