import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import dayjs from "dayjs";

export default function TimerCard({ clients, onSessionUpdated }) {
  const [runningSession, setRunningSession] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [clientId, setClientId] = useState("");
  const [tag, setTag] = useState("");
  const intervalRef = useRef(null);

  const hasRunning = !!runningSession;

  useEffect(() => {
    (async () => {
      const { data } = await api.get("/work");
      const active = data.find((s) => !s.endTime);
      if (active) {
        setRunningSession(active);
      }
    })();
  }, []);

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

  const pretty = useMemo(() => {
    const totalSec = Math.floor(elapsed / 1000);
    const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
    const s = String(totalSec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }, [elapsed]);

  const start = async () => {
    if (!clientId) return alert("Select a client first");
    const { data } = await api.post("/work/start", { clientId, tag });
    setRunningSession(data);
    onSessionUpdated?.();
  };

  const stop = async () => {
    const { data } = await api.post(`/work/stop/${runningSession._id}`);
    setRunningSession(null);
    onSessionUpdated?.();
    alert(`Session saved: ${data.totalHours} hours`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-cyan-900/30 transition-all"
    >
      {" "}
      <h3 className="text-xl font-semibold text-cyan-400 mb-4 flex items-center gap-2">
        {" "}
        <span className="bg-cyan-500/10 p-2 rounded-full">⏱️</span>
        Timer{" "}
      </h3>
      <AnimatePresence mode="wait">
        {!hasRunning ? (
          <motion.div
            key="start"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid sm:grid-cols-3 gap-4 items-center"
          >
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="">Select client</option>
              {clients.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <input
              className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Tag (e.g. development)"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />

            <button
              className="py-2 px-6 bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-semibold rounded-lg transition-colors shadow-md"
              onClick={start}
            >
              Start
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="running"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col sm:flex-row justify-between items-center gap-6"
          >
            <div className="flex flex-col items-center sm:items-start">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm text-gray-400">Tracking time...</span>
              </div>
              <h4 className="text-4xl font-bold text-cyan-300 tracking-wider">
                {pretty}
              </h4>
              <p className="text-gray-400 mt-2 text-sm">
                Started at{" "}
                {dayjs(runningSession.startTime).format("YYYY-MM-DD HH:mm")}
              </p>
            </div>

            <button
              className="py-2 px-6 bg-red-500 hover:bg-red-400 text-white font-semibold rounded-lg transition-colors shadow-md"
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
