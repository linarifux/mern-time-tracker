import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ClientList({ clients, loading, onDelete }) {
  const [loadingText, setLoadingText] = useState("Summoning your clients...");

  // Rotate loading text internally
  useEffect(() => {
    const texts = [
      "Summoning your clients...",
      "Consulting the Rolodex...",
      "Calculating potential wealth...",
      "Polishing the VIP list...",
    ];
    const interval = setInterval(() => {
      setLoadingText(texts[Math.floor(Math.random() * texts.length)]);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -50, scale: 0.9 },
  };

  return (
    <motion.div className="bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-3xl p-6 shadow-xl overflow-hidden">
      <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-2xl">📋</span> The List
        </h3>
        {loading && <span className="text-xs text-cyan-400 animate-pulse">{loadingText}</span>}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-500 border-b border-gray-800 text-xs uppercase tracking-wider">
              <th className="pb-4 pl-4 font-bold">Client</th>
              <th className="pb-4 font-bold">Contact</th>
              <th className="pb-4 font-bold">Rate</th>
              <th className="pb-4 font-bold">Intel</th>
              <th className="pb-4 pr-4 text-right">Action</th>
            </tr>
          </thead>

          <motion.tbody variants={containerVariants} initial="hidden" animate="show">
            <AnimatePresence mode="popLayout">
              {!loading && clients.length === 0 && (
                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td colSpan={5} className="text-center py-12 text-gray-500 italic">
                    It's quiet... too quiet. Add a client above!
                  </td>
                </motion.tr>
              )}

              {clients.map((c) => (
                <motion.tr
                  key={c._id}
                  layout
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="group border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors"
                >
                  <td className="py-4 pl-4">
                    <div className="font-bold text-cyan-100 group-hover:text-cyan-400 transition-colors">
                      {c.name}
                    </div>
                  </td>
                  <td className="py-4 text-gray-400 text-sm">
                    {c.email || <span className="opacity-30">—</span>}
                  </td>
                  <td className="py-4">
                    <span className="bg-green-500/10 text-green-400 px-2 py-1 rounded-md text-xs font-mono font-bold">
                      ${c.hourlyRate}/hr
                    </span>
                  </td>
                  <td className="py-4 text-gray-500 text-sm max-w-[200px] truncate">
                    {c.notes || <span className="opacity-30">—</span>}
                  </td>
                  <td className="py-4 pr-4 text-right">
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded-lg transition-all"
                      onClick={() => onDelete(c)}
                      title="Banish Client"
                    >
                      🗑️
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </motion.tbody>
        </table>
      </div>
    </motion.div>
  );
}