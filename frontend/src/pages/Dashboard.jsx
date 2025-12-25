import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";

// Sub-components
import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsCard from "../components/dashboard/StatsCard";
import EditNoteModal from "../components/modals/EditNoteModal";
import ManualEntryModal from "../components/modals/ManualEntryModal";
import ConfirmationModal from "../components/modals/ConfirmationModal"; // <--- Import this
import SessionTable from "../components/dashboard/SessionTable";
import TimerCard from "../components/dashboard/TimerCard";

export default function Dashboard() {
  const [clients, setClients] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [greeting, setGreeting] = useState("Hello");

  // State: Edit Note
  const [editing, setEditing] = useState(null);
  const [noteValue, setNoteValue] = useState("");

  // State: Manual Entry
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualForm, setManualForm] = useState({
    clientId: "",
    date: new Date().toISOString().split("T")[0],
    hours: "",
    tag: "",
    notes: "",
  });

  // State: Delete Confirmation
  const [sessionToDelete, setSessionToDelete] = useState(null); // <--- New State

  // --- Initial Load & Greeting ---
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
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  // --- Computed Stats ---
  const totalToday = useMemo(() => {
    const today = new Date().toDateString();
    return sessions
      .filter((s) => new Date(s.startTime).toDateString() === today)
      .reduce((sum, s) => sum + (s.totalHours || 0), 0);
  }, [sessions]);

  // --- Handlers ---

  // 1. Trigger the Modal (Don't delete yet)
  const onDeleteClick = (s) => {
    setSessionToDelete(s); 
  };

  // 2. Actually Delete (Called by Modal)
  const confirmDelete = async () => {
    if (!sessionToDelete) return;
    
    // Optimistic Update
    const id = sessionToDelete._id;
    setSessions((prev) => prev.filter((session) => session._id !== id));
    setSessionToDelete(null); // Close modal
    
    try {
      await api.delete(`/work/${id}`);
      load(); // Re-sync
    } catch (error) {
      alert("Failed to delete. Reverting...");
      load();
    }
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

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="min-h-screen bg-gray-950 text-gray-100 p-6 w-full overflow-hidden"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        
        <motion.div variants={itemVariants}>
          <DashboardHeader 
            greeting={greeting} 
            onOpenManualLog={() => setShowManualModal(true)} 
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatsCard totalHours={totalToday} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <TimerCard clients={clients} onSessionUpdated={load} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <SessionTable
            sessions={sessions}
            onDelete={onDeleteClick} // Pass the click handler, not the confirm handler
            onEdit={onEdit}
          />
        </motion.div>

        {/* --- MODALS AREA --- */}
        <AnimatePresence>
          <EditNoteModal 
            isOpen={!!editing}
            onClose={() => setEditing(null)}
            noteValue={noteValue}
            setNoteValue={setNoteValue}
            onSave={saveEdit}
          />

          <ManualEntryModal
            isOpen={showManualModal}
            onClose={() => setShowManualModal(false)}
            clients={clients}
            form={manualForm}
            setForm={setManualForm}
            onSubmit={handleManualSubmit}
          />

          {/* New Delete Confirmation Modal */}
          <ConfirmationModal
            isOpen={!!sessionToDelete}
            onClose={() => setSessionToDelete(null)}
            onConfirm={confirmDelete}
            title="Delete Session?"
            message="You are about to nuke this work session from existence. There is no coming back."
          />
        </AnimatePresence>
      </div>
    </motion.div>
  );
}