import { useEffect, useState } from "react";
import api from "../services/api";
import { AnimatePresence } from "framer-motion";

// Sub-components
import ClientsHeader from "../components/clients/ClientsHeader";
import AddClientForm from "../components/clients/AddClientForm";
import ClientList from "../components/clients/ClientList";
import ConfirmationModal from "../components/modals/ConfirmationModal";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", hourlyRate: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Modal State for Delete
  const [clientToDelete, setClientToDelete] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/clients");
      setClients(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Artificial delay for slick animation feel
      await new Promise((r) => setTimeout(r, 600));
      await api.post("/clients", { ...form, hourlyRate: Number(form.hourlyRate) || 0 });
      setForm({ name: "", email: "", hourlyRate: "", notes: "" });
      load();
    } finally {
      setSubmitting(false);
    }
  };

  // Called when "Yes, Delete" is clicked in modal
  const confirmDelete = async () => {
    if (!clientToDelete) return;
    
    const id = clientToDelete._id;
    // Optimistic UI update
    setClients((prev) => prev.filter((c) => c._id !== id));
    setClientToDelete(null); // Close modal
    
    try {
      await api.delete(`/clients/${id}`);
    } catch (err) {
      alert("Failed to banish client. They are too powerful.");
      load(); // Revert
    }
  };

  const updateField = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        <ClientsHeader count={clients.length} />

        <AddClientForm 
          form={form} 
          updateField={updateField} 
          onSubmit={submit} 
          submitting={submitting} 
        />

        <ClientList 
          clients={clients} 
          loading={loading} 
          onDelete={(client) => setClientToDelete(client)} // Open Modal
        />

        <AnimatePresence>
          <ConfirmationModal
            isOpen={!!clientToDelete}
            onClose={() => setClientToDelete(null)}
            onConfirm={confirmDelete}
            title="Banish Client?"
            message={`Are you sure you want to remove ${clientToDelete?.name}? This cannot be undone.`}
          />
        </AnimatePresence>

      </div>
    </div>
  );
}