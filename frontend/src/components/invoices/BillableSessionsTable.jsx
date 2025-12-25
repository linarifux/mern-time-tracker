import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BillableSessionsTable({ 
  sessions, 
  activeTab, 
  setActiveTab, 
  checked, 
  toggle, 
  totals 
}) {
  // 1. Pagination State
  const [visibleRows, setVisibleRows] = useState(5);

  // 2. Handlers
  const showMore = () => {
    setVisibleRows((prev) => Math.min(prev + 5, sessions.length));
  };

  const showLess = () => {
    setVisibleRows(5);
  };

  // 3. Derived Data
  const visibleSessions = sessions.slice(0, visibleRows);
  const hasMore = visibleRows < sessions.length;
  const isExpanded = visibleRows > 5;

  return (
    <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-3xl shadow-xl overflow-hidden flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        <TabButton 
          isActive={activeTab === "billable"} 
          onClick={() => { setActiveTab("billable"); setVisibleRows(5); }}
          label="Fresh Work (Billable)"
          icon="🔥"
        />
        <TabButton 
          isActive={activeTab === "history"} 
          onClick={() => { setActiveTab("history"); setVisibleRows(5); }}
          label="Ancient History (Invoiced)"
          icon="📜"
        />
      </div>

      <div className="p-0 overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-950/30 text-gray-400 font-bold uppercase text-xs tracking-wider">
            <tr>
              {activeTab === "billable" && <th className="py-4 px-6 w-16">Select</th>}
              <th className="py-4 px-6">Date</th>
              <th className="py-4 px-6">Client</th>
              <th className="py-4 px-6">Effort</th>
              <th className="py-4 px-6">Details</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-800/50">
            <AnimatePresence mode="popLayout">
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500 italic">
                    {activeTab === "billable" 
                      ? "No work done? Or just efficiently lazy? 😴" 
                      : "No history found. You're a ghost! 👻"}
                  </td>
                </tr>
              ) : (
                visibleSessions.map((s) => (
                  <motion.tr 
                    layout
                    key={s._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="hover:bg-gray-800/30 transition-colors group"
                  >
                    {activeTab === "billable" && (
                      <td className="py-4 px-6">
                        <motion.input
                          whileTap={{ scale: 0.8 }}
                          type="checkbox"
                          checked={!!checked[s._id]}
                          onChange={() => toggle(s._id)}
                          className="w-5 h-5 rounded border-gray-600 text-green-500 focus:ring-green-500 bg-gray-900 cursor-pointer accent-green-500"
                        />
                      </td>
                    )}
                    <td className="py-4 px-6 text-gray-300 whitespace-nowrap">
                      {new Date(s.startTime).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 font-medium text-cyan-200 whitespace-nowrap">
                      {s.clientId?.name}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="font-mono text-green-400 bg-green-900/20 px-2 py-1 rounded">
                        {s.totalHours?.toFixed(2)} hr
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-500 max-w-xs truncate group-hover:text-gray-300 transition-colors" title={s.notes}>
                      {s.notes || "—"}
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>

          {/* Totals Footer */}
          {sessions.length > 0 && (
            <tfoot className="bg-gray-900/80 border-t-2 border-gray-800">
              <tr>
                {activeTab === "billable" && <td></td>}
                <td colSpan={2} className="py-5 px-6 text-right font-bold text-gray-400 uppercase tracking-widest text-xs">
                  List Total
                </td>
                <td className="py-5 px-6">
                   <div className="flex flex-col">
                      <span className="text-gray-400 text-xs">{totals.hours.toFixed(2)} hrs</span>
                      <span className="text-xl font-black text-green-400">${totals.amount.toFixed(2)}</span>
                   </div>
                </td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Pagination Controls */}
      {(hasMore || isExpanded) && (
        <div className="p-6 flex justify-center gap-4 bg-gray-900/20 border-t border-gray-800">
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
    </div>
  );
}

function TabButton({ isActive, onClick, label, icon }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-4 text-sm font-bold transition-all relative ${
        isActive ? "text-cyan-400" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
      }`}
    >
      <span className="flex items-center justify-center gap-2">
        <span className="text-lg">{icon}</span> {label}
      </span>
      {isActive && (
        <motion.div 
          layoutId="activeTab"
          className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-cyan-500 to-blue-500"
        />
      )}
    </button>
  );
}