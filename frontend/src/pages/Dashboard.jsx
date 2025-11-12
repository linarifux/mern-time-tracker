import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import TimerCard from "../components/TimerCard";
import SessionTable from "../components/SessionTable";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const [clients, setClients] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [editing, setEditing] = useState(null);
  const [noteValue, setNoteValue] = useState("");

  const load = async () => {
    const [{ data: cs }, { data: ss }] = await Promise.all([
      api.get("/clients"),
      api.get("/work"),
    ]);
    setClients(cs);
    setSessions(
      ss.sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
    );
  };

  useEffect(() => {
    load();
  }, []);

  const totalToday = useMemo(() => {
    const today = new Date().toDateString();
    return sessions
      .filter((s) => new Date(s.startTime).toDateString() === today)
      .reduce((sum, s) => sum + (s.totalHours || 0), 0);
  }, [sessions]);

  const onDelete = async (s) => {
    if (!confirm("Delete this session?")) return;
    await api.delete(`/work/${s._id}`);
    load();
  };

  const onEdit = (s) => {
    setEditing(s);
    setNoteValue(s.notes || "");
  };

  const saveEdit = async () => {
    await api.put(`/work/${editing._id}`, { notes: noteValue });
    setEditing(null);
    setNoteValue("");
    load();
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-950 via-gray-900 to-gray-950 text-gray-100 p-6">
      {" "}
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-cyan-900/30 transition-shadow"
        >
          {" "}
          <h2 className="text-3xl font-bold text-cyan-400 mb-2 flex items-center gap-2">
            {" "}
            <span className="bg-cyan-500/10 p-2 rounded-full">📊</span>
            Dashboard Overview{" "}
          </h2>{" "}
          <p className="text-gray-400 text-lg">
            You’ve logged{" "}
            <span className="text-cyan-300 font-semibold">
              {totalToday.toFixed(2)}
            </span>{" "}
            hours today — great job!
          </p>
        </motion.div>

        {/* Timer Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <TimerCard clients={clients} onSessionUpdated={load} />
        </motion.div>

        {/* Sessions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <SessionTable
            sessions={sessions}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </motion.div>

        {/* Edit Notes Modal */}
        <AnimatePresence>
          {editing && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-lg shadow-2xl"
              >
                <h3 className="text-2xl font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                  <span className="bg-cyan-500/10 p-2 rounded-full">📝</span>
                  Edit Work Notes
                </h3>
                <textarea
                  rows={5}
                  value={noteValue}
                  onChange={(e) => setNoteValue(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="Describe your work..."
                />
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-semibold transition-colors"
                    onClick={saveEdit}
                  >
                    Save
                  </button>
                  <button
                    className="px-5 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold transition-colors"
                    onClick={() => setEditing(null)}
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
