import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ClientList({ clients, loading, onDelete }) {
  const [loadingText, setLoadingText] = useState("Summoning your clients...");
  
  // Pagination State
  const [visibleRows, setVisibleRows] = useState(5);

  // Pagination Handlers
  const showMore = () => setVisibleRows((prev) => Math.min(prev + 5, clients.length));
  const showLess = () => setVisibleRows(5);
  
  const displayClients = clients.slice(0, visibleRows);
  const hasMore = visibleRows < clients.length;
  const isExpanded = visibleRows > 5;

  // Loading Text Rotation
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

  // Animation Variants
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95 },
  };

  return (
    <motion.div 
      layout
      className="bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-3xl p-6 shadow-xl overflow-hidden flex flex-col"
    >
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-2xl">📋</span> The List
        </h3>
        {loading ? (
          <span className="text-xs text-cyan-400 animate-pulse">{loadingText}</span>
        ) : (
          <span className="text-xs font-mono text-gray-500 bg-gray-800/50 px-2 py-1 rounded-md">
            Showing {displayClients.length} / {clients.length}
          </span>
        )}
      </div>

      {!loading && clients.length === 0 ? (
        <div className="text-center py-12 text-gray-500 italic">
          It's quiet... too quiet. Add a client above!
        </div>
      ) : (
        <>
          {/* ============================================== */}
          {/* MOBILE VIEW (CARDS) - Visible on small screens */}
          {/* ============================================== */}
          <div className="md:hidden space-y-4">
            <AnimatePresence mode="popLayout">
              {displayClients.map((c) => (
                <motion.div
                  key={c._id}
                  layout
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-5 shadow-sm active:scale-[0.99] transition-transform"
                >
                  {/* Card Header: Name & Rate */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-cyan-300 font-bold text-lg leading-tight">
                        {c.name}
                      </h4>
                      <p className="text-gray-500 text-xs mt-1 truncate max-w-[180px]">
                        {c.email || "No email provided"}
                      </p>
                    </div>
                    <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-lg font-mono font-bold text-sm">
                      ${c.hourlyRate}/hr
                    </span>
                  </div>

                  {/* Card Body: Notes */}
                  {c.notes && (
                    <div className="mb-4">
                      <p className="text-gray-400 text-sm italic border-l-2 border-gray-700 pl-3 py-1">
                        {c.notes}
                      </p>
                    </div>
                  )}

                  {/* Card Actions */}
                  <div className="pt-3 border-t border-gray-700/50 flex justify-end">
                    <button
                      onClick={() => onDelete(c)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-red-500/20 text-gray-300 hover:text-red-400 rounded-xl transition-colors font-medium text-sm"
                    >
                      🗑️ Banish Client
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* ============================================== */}
          {/* DESKTOP VIEW (TABLE) - Visible on md+ screens  */}
          {/* ============================================== */}
          <div className="hidden md:block overflow-x-auto">
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

              <tbody className="divide-y divide-gray-800/30">
                <AnimatePresence mode="popLayout">
                  {displayClients.map((c) => (
                    <motion.tr
                      key={c._id}
                      layout
                      variants={itemVariants}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      className="group hover:bg-gray-800/40 transition-colors"
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
                          className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded-lg transition-all ml-auto"
                          onClick={() => onDelete(c)}
                          title="Banish Client"
                        >
                          🗑️
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* --- PAGINATION CONTROLS --- */}
          {(hasMore || isExpanded) && (
            <div className="mt-6 flex justify-center gap-4">
              {hasMore && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={showMore}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-cyan-400 font-bold rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all flex items-center gap-2 text-sm shadow-lg w-full md:w-auto justify-center"
                >
                  👇 See More
                </motion.button>
              )}
              
              {isExpanded && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={showLess}
                  className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-gray-400 font-bold rounded-xl border border-gray-800 hover:border-gray-600 transition-all flex items-center gap-2 text-sm w-full md:w-auto justify-center"
                >
                  ☝️ Show Less
                </motion.button>
              )}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}