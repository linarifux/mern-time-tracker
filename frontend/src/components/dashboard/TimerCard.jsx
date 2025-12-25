import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import dayjs from "dayjs";

export default function TimerCard({ clients, onSessionUpdated }) {
  const [runningSession, setRunningSession] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  // Form State
  const [clientId, setClientId] = useState("");
  const [tag, setTag] = useState("");
  const [notes, setNotes] = useState(""); 

  const intervalRef = useRef(null);
  const hasRunning = !!runningSession;

  // 1. Check for active session on mount
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/work");
        // Find session with no endTime
        const active = data.find((s) => !s.endTime);
        if (active) {
          setRunningSession(active);
          setNotes(active.notes || ""); // Pre-fill notes if existing
        }
      } catch (err) {
        console.error("Error fetching active session:", err);
      }
    })();
  }, []);

  // 2. Timer Interval Logic
  useEffect(() => {
    if (!runningSession) {
      setElapsed(0);
      return;
    }
    
    const start = dayjs(runningSession.startTime).valueOf();
    
    // Update immediately then set interval
    setElapsed(Date.now() - start);
    intervalRef.current = setInterval(() => {
      setElapsed(Date.now() - start);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [runningSession]);

  // 3. Format HH:MM:SS
  const prettyTime = useMemo(() => {
    const totalSec = Math.floor(elapsed / 1000);
    const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
    const s = String(totalSec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }, [elapsed]);

  // --- ACTIONS ---

  const start = async () => {
    if (!clientId) return alert("Please select a client first.");
    
    try {
      // Send notes to backend
      const { data } = await api.post("/work/start", { clientId, tag, notes });
      setRunningSession(data);
      onSessionUpdated?.();
    } catch (err) {
      console.error(err);
      alert("Failed to start timer");
    }
  };

  const stop = async () => {
    try {
      // Send updated notes to backend on stop
      const { data } = await api.post(`/work/stop/${runningSession._id}`, { notes });
      
      setRunningSession(null);
      
      // Reset Form
      setClientId("");
      setTag("");
      setNotes("");

      onSessionUpdated?.();
      // Optional: Toast notification here instead of alert
      alert(`Session stopped. Total: ${data.totalHours} hours.`);
    } catch (err) {
      console.error(err);
      alert("Failed to stop timer");
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden group"
    >
      {/* Background Glow Effect */}
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] transition-all duration-1000 ${hasRunning ? 'bg-green-500/10' : 'bg-cyan-500/10'}`} />

      <div className="relative z-10">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${hasRunning ? 'bg-green-900/30 text-green-400' : 'bg-cyan-900/30 text-cyan-400'}`}>
            {hasRunning ? '⚡' : '⏱️'}
          </div>
          {hasRunning ? "Current Session" : "Start New Session"}
        </h3>

        <AnimatePresence mode="wait">
          {!hasRunning ? (
            // --- START VIEW ---
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-gray-950/50 border border-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all cursor-pointer hover:bg-gray-900"
                >
                  <option value="">Select Client...</option>
                  {clients.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <input
                  className="w-full px-4 py-3.5 rounded-xl bg-gray-950/50 border border-gray-800 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                  placeholder="Tag (e.g. Development)"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                />
              </div>

              {/* Notes Input */}
              <textarea
                rows={2}
                className="w-full px-4 py-3.5 rounded-xl bg-gray-950/50 border border-gray-800 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all resize-none"
                placeholder="Session notes (optional)..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-900/20 transition-all text-lg"
                onClick={start}
              >
                Start Timer
              </motion.button>
            </motion.div>
          ) : (
            // --- RUNNING VIEW ---
            <motion.div
              key="running"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8"
            >
              <div className="flex-1 w-full space-y-4">
                {/* Timer Display */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-sm font-medium text-green-400 uppercase tracking-wider">Tracking</span>
                  </div>
                  
                  <h4 className="text-6xl font-black text-white tracking-tighter tabular-nums">
                    {prettyTime}
                  </h4>
                  <p className="text-gray-500 text-sm font-medium mt-1">
                    Started at {dayjs(runningSession.startTime).format("h:mm A")}
                  </p>
                </div>

                {/* Editable Notes */}
                <div className="relative group">
                  <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Quick Notes</label>
                  <textarea
                    rows={1}
                    className="w-full bg-transparent border-b border-gray-700 text-gray-300 text-sm focus:outline-none focus:border-green-500 transition-all resize-none py-1 group-hover:border-gray-600"
                    placeholder="Add details..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              {/* Stop Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full lg:w-auto h-24 rounded-full bg-red-500/10 border-2 border-red-500/50 hover:bg-red-500 hover:border-red-500 text-red-500 hover:text-white transition-all flex flex-col items-center justify-center gap-1 shadow-[0_0_30px_rgba(239,68,68,0.2)]"
                onClick={stop}
              >
                <span className="text-2xl font-bold">STOP</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}