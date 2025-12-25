import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InvoiceHistoryTable({ invoices, onMarkPaid, onGeneratePDF }) {
  // 1. State for pagination
  const [visibleRows, setVisibleRows] = useState(5);

  // 2. Handlers
  const showMore = () => {
    setVisibleRows((prev) => Math.min(prev + 5, invoices.length));
  };

  const showLess = () => {
    setVisibleRows(5);
  };

  // 3. Derived state
  const hasMore = visibleRows < invoices.length;
  const isExpanded = visibleRows > 5;
  const visibleInvoices = invoices.slice(0, visibleRows);

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95 },
  };

  return (
    <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-3xl p-6 shadow-xl flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-2xl">🗄️</span> Paper Trail
        </h3>
        {invoices.length > 0 && (
          <span className="text-xs font-mono text-gray-500 bg-gray-800/50 px-2 py-1 rounded-md">
            Showing {visibleInvoices.length} / {invoices.length}
          </span>
        )}
      </div>

      <div className="overflow-hidden">
        {invoices.length === 0 ? (
          <div className="py-12 text-center text-gray-500 italic">
             No invoices yet. Time to get to work! 💼
          </div>
        ) : (
          <>
            {/* ========================== */}
            {/* MOBILE CARD VIEW (< md)    */}
            {/* ========================== */}
            <div className="md:hidden space-y-4">
              <AnimatePresence mode="popLayout">
                {visibleInvoices.map((inv) => (
                  <motion.div
                    key={inv._id}
                    layout
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-5 shadow-sm"
                  >
                    {/* Header: Client & Amount */}
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-gray-200 font-bold text-lg">{inv.clientId?.name}</h4>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(inv.issuedAt || inv.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-green-400 text-lg">
                          ${inv.totalAmount?.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-600">{inv.sessions?.length || 0} sessions</div>
                      </div>
                    </div>

                    {/* Footer: Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-700/50 mt-2">
                      {/* Status Toggle */}
                      <label className="inline-flex items-center cursor-pointer group/check">
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={inv.status === "Paid"}
                          onChange={() => onMarkPaid(inv)}
                        />
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                          inv.status === "Paid" 
                            ? "bg-green-500/20 text-green-400 border-green-500/50" 
                            : "bg-yellow-500/10 text-yellow-500 border-yellow-500/30 group-hover/check:bg-yellow-500/20"
                        }`}>
                          {inv.status === "Paid" ? "PAID ✅" : "PENDING ⏳"}
                        </span>
                      </label>

                      {/* PDF Button */}
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onGeneratePDF(inv)}
                        className="p-2 bg-gray-700 hover:bg-cyan-900/50 text-cyan-400 rounded-lg border border-gray-600 transition-colors"
                        title="Download PDF"
                      >
                        📄 PDF
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* ========================== */}
            {/* DESKTOP TABLE VIEW (>= md) */}
            {/* ========================== */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-800 text-xs uppercase tracking-wider">
                    <th className="pb-4 pl-4 text-left">Client</th>
                    <th className="pb-4 text-left">Loot ($)</th>
                    <th className="pb-4 text-left">Date</th>
                    <th className="pb-4 text-center">Status</th>
                    <th className="pb-4 pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  <AnimatePresence mode="popLayout">
                    {visibleInvoices.map((inv) => (
                      <motion.tr 
                        layout
                        key={inv._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="group hover:bg-gray-800/30 transition-colors"
                      >
                        <td className="py-4 pl-4">
                          <div className="font-bold text-gray-200">{inv.clientId?.name}</div>
                          <div className="text-xs text-gray-600">{inv.sessions?.length || 0} sessions</div>
                        </td>
                        <td className="py-4 font-mono font-bold text-green-400">
                          ${inv.totalAmount?.toFixed(2)}
                        </td>
                        <td className="py-4 text-gray-500">
                          {new Date(inv.issuedAt || inv.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 text-center">
                          <label className="inline-flex items-center cursor-pointer group/check">
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={inv.status === "Paid"}
                              onChange={() => onMarkPaid(inv)}
                            />
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                              inv.status === "Paid" 
                                ? "bg-green-500/20 text-green-400 border-green-500/50" 
                                : "bg-yellow-500/10 text-yellow-500 border-yellow-500/30 group-hover/check:bg-yellow-500/20"
                            }`}>
                              {inv.status === "Paid" ? "PAID ✅" : "PENDING ⏳"}
                            </span>
                          </label>
                        </td>
                        <td className="py-4 pr-4 text-right">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onGeneratePDF(inv)}
                            className="p-2 bg-gray-800 hover:bg-cyan-900/50 text-cyan-400 rounded-lg transition-colors border border-gray-700 hover:border-cyan-500/50"
                            title="Download PDF"
                          >
                            📄
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* 4. Pagination Controls (Shared) */}
      {(hasMore || isExpanded) && (
        <div className="mt-6 flex justify-center gap-4">
          {hasMore && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={showMore}
              className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-cyan-400 font-bold rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all flex items-center gap-2 text-sm shadow-lg w-full md:w-auto justify-center"
            >
              👇 See More
            </motion.button>
          )}

          {isExpanded && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={showLess}
              className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-gray-400 font-bold rounded-xl border border-gray-800 hover:border-gray-600 transition-all flex items-center gap-2 text-sm w-full md:w-auto justify-center"
            >
              ☝️ Show Less
            </motion.button>
          )}
        </div>
      )}
    </div>
  );
}