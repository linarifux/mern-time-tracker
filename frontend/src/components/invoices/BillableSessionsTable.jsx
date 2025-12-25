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
  const [visibleRows, setVisibleRows] = useState(5);

  const showMore = () => setVisibleRows((prev) => Math.min(prev + 5, sessions.length));
  const showLess = () => setVisibleRows(5);

  const visibleSessions = sessions.slice(0, visibleRows);
  const hasMore = visibleRows < sessions.length;
  const isExpanded = visibleRows > 5;

  return (
    <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-3xl shadow-xl overflow-hidden flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-gray-800 sticky top-0 bg-gray-900/95 z-10 backdrop-blur-md">
        <TabButton 
          isActive={activeTab === "billable"} 
          onClick={() => { setActiveTab("billable"); setVisibleRows(5); }}
          label="Billable"
          icon="🔥"
        />
        <TabButton 
          isActive={activeTab === "history"} 
          onClick={() => { setActiveTab("history"); setVisibleRows(5); }}
          label="History"
          icon="📜"
        />
      </div>

      <div className="p-4 md:p-0">
        {sessions.length === 0 ? (
          <div className="py-12 text-center text-gray-500 italic">
            {activeTab === "billable" 
              ? "No work done? Or just efficiently lazy? 😴" 
              : "No history found. You're a ghost! 👻"}
          </div>
        ) : (
          <>
            {/* ========================== */}
            {/* MOBILE CARD VIEW (< md)    */}
            {/* ========================== */}
            <div className="md:hidden space-y-3">
              <AnimatePresence mode="popLayout">
                {visibleSessions.map((s) => (
                  <motion.div
                    key={s._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`relative p-4 rounded-2xl border transition-all ${
                      checked[s._id] 
                        ? "bg-cyan-900/20 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]" 
                        : "bg-gray-800/40 border-gray-700/50"
                    }`}
                    onClick={() => activeTab === "billable" && toggle(s._id)} // Tap card to select
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        {activeTab === "billable" && (
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                            checked[s._id] ? "bg-cyan-500 border-cyan-500" : "border-gray-500"
                          }`}>
                            {checked[s._id] && <span className="text-white text-xs font-bold">✓</span>}
                          </div>
                        )}
                        <div>
                          <h4 className="text-gray-200 font-bold leading-tight">{s.clientId?.name}</h4>
                          <span className="text-xs text-gray-500">{new Date(s.startTime).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <span className="font-mono text-green-400 bg-green-900/20 px-2 py-1 rounded text-sm font-bold">
                        {s.totalHours?.toFixed(2)} hr
                      </span>
                    </div>
                    
                    {s.notes && (
                      <p className="text-gray-400 text-sm mt-2 line-clamp-2 pl-8">
                        {s.notes}
                      </p>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* ========================== */}
            {/* DESKTOP TABLE VIEW (>= md) */}
            {/* ========================== */}
            <div className="hidden md:block overflow-x-auto">
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
                    {visibleSessions.map((s) => (
                      <motion.tr 
                        layout
                        key={s._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="hover:bg-gray-800/30 transition-colors group cursor-pointer"
                        onClick={() => activeTab === "billable" && toggle(s._id)} // Click row to select
                      >
                        {activeTab === "billable" && (
                          <td className="py-4 px-6">
                            <motion.div
                              whileTap={{ scale: 0.8 }}
                              className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                checked[s._id] ? "bg-cyan-500 border-cyan-500" : "border-gray-600 bg-gray-900"
                              }`}
                            >
                               {checked[s._id] && <span className="text-white text-xs font-bold">✓</span>}
                            </motion.div>
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
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* --- FOOTER & PAGINATION --- */}
      {sessions.length > 0 && (
        <div className="bg-gray-900/80 border-t-2 border-gray-800 p-4 md:px-6 md:py-4">
          {/* Totals Section */}
          <div className="flex justify-between items-center mb-4 md:mb-0 md:hidden">
             <span className="text-gray-400 uppercase text-xs font-bold tracking-widest">Total</span>
             <div className="text-right">
                <div className="text-xs text-gray-400">{totals.hours.toFixed(2)} hrs</div>
                <div className="text-xl font-black text-green-400">${totals.amount.toFixed(2)}</div>
             </div>
          </div>

          <div className="hidden md:flex justify-end items-center gap-8 mb-4">
             <span className="text-gray-400 uppercase text-xs font-bold tracking-widest">List Total</span>
             <div className="text-right">
                <span className="text-gray-400 text-xs mr-2">{totals.hours.toFixed(2)} hrs</span>
                <span className="text-xl font-black text-green-400">${totals.amount.toFixed(2)}</span>
             </div>
          </div>

          {/* Pagination Buttons */}
          {(hasMore || isExpanded) && (
            <div className="flex justify-center gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-gray-800">
              {hasMore && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={showMore}
                  className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-cyan-400 font-bold rounded-xl border border-gray-700 w-full md:w-auto text-sm"
                >
                  👇 See More
                </motion.button>
              )}
              {isExpanded && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={showLess}
                  className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-gray-400 font-bold rounded-xl border border-gray-800 w-full md:w-auto text-sm"
                >
                  ☝️ Show Less
                </motion.button>
              )}
            </div>
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
        <span className="text-lg">{icon}</span> 
        <span className="hidden md:inline">{label}</span>
        <span className="md:hidden">{label.split(' ')[0]}</span> {/* Short label for mobile */}
      </span>
      {isActive && (
        <motion.div 
          layoutId="activeTab"
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500"
        />
      )}
    </button>
  );
}