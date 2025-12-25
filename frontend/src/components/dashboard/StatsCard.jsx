import { motion } from "framer-motion";

export default function StatsCard({ totalHours }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden group"
    >
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] group-hover:bg-cyan-500/20 transition-all duration-700"></div>

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <h2 className="text-gray-400 font-medium text-lg mb-1">Total Hours Today</h2>
          <div className="flex items-baseline gap-2">
            <motion.span
              key={totalHours} // Re-animate when number changes
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="text-6xl font-black text-white"
            >
              {totalHours.toFixed(2)}
            </motion.span>
            <span className="text-xl text-cyan-500 font-bold">hrs</span>
          </div>
        </div>
        <div className="text-5xl opacity-80 animate-pulse">
          {totalHours > 0 ? '🔥' : '☕'}
        </div>
      </div>
    </motion.div>
  );
}