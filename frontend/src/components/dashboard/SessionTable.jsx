import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";

export default function SessionTable({ sessions, onDelete, onEdit }) {
  const [visibleRows, setVisibleRows] = useState(5);

  const showMore = () => {
    setVisibleRows((prev) => Math.min(prev + 5, sessions.length));
  };

  const showLess = () => {
    setVisibleRows(5);
  };

  const hasMore = visibleRows < sessions.length;
  const isExpanded = visibleRows > 5;

  // Animation variants
  const tableContainerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  return (
    <motion.div
      layout
      variants={tableContainerVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5 }}
      className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-3xl p-6 shadow-xl overflow-hidden flex flex-col"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-2xl">📜</span> Recent Sessions
        </h3>
        <span className="text-xs font-mono text-gray-500 bg-gray-800/50 px-2 py-1 rounded-md">
          Showing {Math.min(visibleRows, sessions.length)} / {sessions.length}
        </span>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-10 text-gray-500 italic">
          No sessions logged yet. Get to work! 🔨
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="bg-gray-950/30 text-gray-400 font-bold uppercase text-xs tracking-wider">
                <tr>
                  <th className="py-4 px-4 rounded-l-lg">Date</th>
                  <th className="py-4 px-4">Client</th>
                  <th className="py-4 px-4">Time</th>
                  <th className="py-4 px-4">Hrs</th>
                  <th className="py-4 px-4">Notes</th>
                  <th className="py-4 px-4">Tag</th>
                  <th className="py-4 px-4 text-center rounded-r-lg">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/30">
                <AnimatePresence mode="popLayout">
                  {sessions.slice(0, visibleRows).map((s) => (
                    <motion.tr
                      layout
                      key={s._id}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="group hover:bg-gray-800/40 transition-colors"
                    >
                      <td className="py-4 px-4 whitespace-nowrap text-gray-300">
                        {dayjs(s.startTime).format("MMM D, YYYY")}
                      </td>
                      
                      <td className="py-4 px-4 whitespace-nowrap font-bold text-cyan-200">
                        {s.clientId?.name || "—"}
                      </td>
                      
                      <td className="py-4 px-4 whitespace-nowrap text-gray-400 text-xs">
                        {dayjs(s.startTime).format("HH:mm")} - {s.endTime ? dayjs(s.endTime).format("HH:mm") : "..."}
                      </td>
                      
                      <td className="py-4 px-4 whitespace-nowrap">
                         <span className="bg-cyan-900/30 text-cyan-400 px-2 py-1 rounded font-mono text-xs">
                            {s.totalHours?.toFixed(2) ?? "0.00"}
                         </span>
                      </td>
                      
                      <td className="py-4 px-4 max-w-[150px] truncate text-gray-500 group-hover:text-gray-400 transition-colors" title={s.notes}>
                        {s.notes || "—"}
                      </td>
                      
                      <td className="py-4 px-4 whitespace-nowrap">
                        {s.tag ? (
                          <span className="text-xs bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20">
                            #{s.tag}
                          </span>
                        ) : (
                          <span className="opacity-20">—</span>
                        )}
                      </td>
                      
                      <td className="py-4 px-4 text-center">
                        <div className="flex justify-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEdit(s)}
                            className="p-1.5 bg-gray-700 hover:bg-cyan-600 text-gray-300 hover:text-white rounded-md transition-all"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => onDelete(s)}
                            className="p-1.5 bg-gray-700 hover:bg-red-500 text-gray-300 hover:text-white rounded-md transition-all"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {(hasMore || isExpanded) && (
            <div className="mt-6 flex justify-center gap-4">
              {hasMore && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={showMore}
                  className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-cyan-400 font-bold rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all flex items-center gap-2 text-sm shadow-lg"
                >
                  👇 See More
                </motion.button>
              )}
              
              {isExpanded && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={showLess}
                  className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-gray-400 font-bold rounded-xl border border-gray-800 hover:border-gray-600 transition-all flex items-center gap-2 text-sm"
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