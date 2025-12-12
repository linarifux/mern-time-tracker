import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import TimerCard from "../components/TimerCard";
import SessionTable from "../components/SessionTable";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const [clients, setClients] = useState([]);
  const [sessions, setSessions] = useState([]);
  
  // Edit Note State
  const [editing, setEditing] = useState(null);
  const [noteValue, setNoteValue] = useState("");

  // Manual Entry State
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualForm, setManualForm] = useState({
    clientId: "",
    date: new Date().toISOString().split("T")[0], // Default to today YYYY-MM-DD
    hours: "",
    tag: "",
    notes: "",
  });

  const load = async () => {
    try {
      const [{ data: cs }, { data: ss }] = await Promise.all([
        api.get("/clients"),
        api.get("/work"),
      ]);
      setClients(cs);
      setSessions(
        ss.sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
      );
    } catch (err) {
      console.error("Failed to load data", err);
    }
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

  // --- Actions ---

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

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualForm.clientId || !manualForm.hours) {
      alert("Please select a client and enter hours.");
      return;
    }

    try {
      await api.post("/work/manual", {
        clientId: manualForm.clientId,
        date: manualForm.date,
        totalHours: Number(manualForm.hours),
        tag: manualForm.tag,
        notes: manualForm.notes,
      });
      
      // Reset and reload
      setShowManualModal(false);
      setManualForm({
        clientId: "",
        date: new Date().toISOString().split("T")[0],
        hours: "",
        tag: "",
        notes: "",
      });
      load();
    } catch (error) {
      console.error("Error logging manual time:", error);
      alert("Failed to log time.");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-950 via-gray-900 to-gray-950 text-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Card with Manual Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-cyan-900/30 transition-shadow flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div>
            <h2 className="text-3xl font-bold text-cyan-400 mb-2 flex items-center gap-2">
              <span className="bg-cyan-500/10 p-2 rounded-full">📊</span>
              Dashboard Overview
            </h2>
            <p className="text-gray-400 text-lg">
              You’ve logged{" "}
              <span className="text-cyan-300 font-semibold">
                {totalToday.toFixed(2)}
              </span>{" "}
              hours today — great job!
            </p>
          </div>
          
          <button
            onClick={() => setShowManualModal(true)}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-cyan-500/50 text-cyan-400 font-semibold rounded-xl transition-all shadow-md flex items-center gap-2"
          >
            <span>+</span> Log Manual Time
          </button>
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

        {/* Modals Container */}
        <AnimatePresence>
          
          {/* 1. Edit Notes Modal */}
          {editing && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditing(null)} // Close on backdrop click
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()} // Prevent close on modal click
              >
                <h3 className="text-2xl font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                  <span className="bg-cyan-500/10 p-2 rounded-full">📝</span>
                  Edit Work Notes
                </h3>
                <textarea
                  rows={5}
                  value={noteValue}
                  onChange={(e) => setNoteValue(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                  placeholder="Describe your work..."
                />
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    className="px-5 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold transition-colors"
                    onClick={() => setEditing(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors shadow-lg shadow-cyan-900/20"
                    onClick={saveEdit}
                  >
                    Save Changes
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* 2. Manual Time Entry Modal */}
          {showManualModal && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowManualModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-semibold text-cyan-400 mb-6 flex items-center gap-2">
                  <span className="bg-cyan-500/10 p-2 rounded-full">⏱️</span>
                  Log Manual Time
                </h3>

                <form onSubmit={handleManualSubmit} className="space-y-4">
                  {/* Client Select */}
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Client</label>
                    <select
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                      value={manualForm.clientId}
                      onChange={(e) => setManualForm({ ...manualForm, clientId: e.target.value })}
                      required
                    >
                      <option value="">Select a Client</option>
                      {clients.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date & Hours Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Date</label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                        value={manualForm.date}
                        onChange={(e) => setManualForm({ ...manualForm, date: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Hours</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        placeholder="e.g. 1.5"
                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                        value={manualForm.hours}
                        onChange={(e) => setManualForm({ ...manualForm, hours: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Project Tag */}
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Project / Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. Website Redesign"
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                      value={manualForm.tag}
                      onChange={(e) => setManualForm({ ...manualForm, tag: e.target.value })}
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Notes</label>
                    <textarea
                      rows={3}
                      placeholder="What did you work on?"
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                      value={manualForm.notes}
                      onChange={(e) => setManualForm({ ...manualForm, notes: e.target.value })}
                    />
                  </div>

                  <div className="mt-6 flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      className="px-5 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold transition-colors"
                      onClick={() => setShowManualModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors shadow-lg shadow-cyan-900/20"
                    >
                      Add Entry
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}