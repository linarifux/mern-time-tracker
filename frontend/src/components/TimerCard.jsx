import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import dayjs from "dayjs";

export default function TimerCard({ clients, onSessionUpdated }) {
  const [runningSession, setRunningSession] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  
  // Form State
  const [clientId, setClientId] = useState("");
  const [tag, setTag] = useState("");
  const [notes, setNotes] = useState(""); // <--- New State for Notes

  const intervalRef = useRef(null);
  const hasRunning = !!runningSession;

  // Load active session on mount
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/work");
        const active = data.find((s) => !s.endTime);
        if (active) {
          setRunningSession(active);
          setNotes(active.notes || ""); // Pre-fill notes if running
        }
      } catch (err) {
        console.error("Failed to check active session", err);
      }
    })();
  }, []);

  // Timer Interval
  useEffect(() => {
    if (!runningSession) {
      setElapsed(0);
      return;
    }
    const start = dayjs(runningSession.startTime).valueOf();
    intervalRef.current = setInterval(() => {
      setElapsed(Date.now() - start);
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [runningSession]);

  // Format Time
  const pretty = useMemo(() => {
    const totalSec = Math.floor(elapsed / 1000);
    const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
    const s = String(totalSec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }, [elapsed]);

  const start = async () => {
    if (!clientId) return alert("Select a client first");
    try {
      // Send notes along with other data
      const { data } = await api.post("/work/start", { clientId, tag, notes });
      setRunningSession(data);
      onSessionUpdated?.();
    } catch (err) {
      alert("Failed to start timer");
    }
  };

  const stop = async () => {
    try {
      // Send the latest notes when stopping (in case they were edited)
      const { data } = await api.post(`/work/stop/${runningSession._id}`, { notes });
      setRunningSession(null);
      // Reset form
      setClientId("");
      setTag("");
      setNotes("");
      
      onSessionUpdated?.();
      alert(`Session saved: ${data.totalHours} hours`);
    } catch (err) {
      alert("Failed to stop timer");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-cyan-900/30 transition-all"
    >
      <h3 className="text-xl font-semibold text-cyan-400 mb-4 flex items-center gap-2">
        <span className="bg-cyan-500/10 p-2 rounded-full">⏱️</span>
        Timer
      </h3>
      
      <AnimatePresence mode="wait">
        {!hasRunning ? (
          // --- START VIEW ---
          <motion.div
            key="start"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-4" // Changed to vertical stack for better layout with notes
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 w-full"
              >
                <option value="">Select client</option>
                {clients.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <input
                className="px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 w-full"
                placeholder="Tag (e.g. dev)"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              />
            </div>

            {/* Notes Input */}
            <textarea
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
              placeholder="Session notes (optional)..."
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <button
              className="w-full sm:w-auto py-2 px-8 bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-semibold rounded-lg transition-colors shadow-md"
              onClick={start}
            >
              Start Timer
            </button>
          </motion.div>
        ) : (
          // --- RUNNING VIEW ---
          <motion.div
            key="running"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col sm:flex-row justify-between items-start gap-6"
          >
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-block w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm text-gray-400">Tracking time...</span>
              </div>
              
              <h4 className="text-4xl font-bold text-cyan-300 tracking-wider">
                {pretty}
              </h4>
              
              <p className="text-gray-400 text-sm">
                Started at {dayjs(runningSession.startTime).format("HH:mm")}
              </p>

              {/* Editable Notes while running */}
              <div className="mt-2 w-full max-w-md">
                <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Notes</label>
                <textarea
                  className="w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 resize-none"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes..."
                />
              </div>
            </div>

            <button
              className="py-3 px-8 bg-red-500 hover:bg-red-400 text-white font-semibold rounded-lg transition-colors shadow-md w-full sm:w-auto mt-4 sm:mt-0"
              onClick={stop}
            >
              Stop
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}