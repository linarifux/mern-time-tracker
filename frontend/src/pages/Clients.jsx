import { useEffect, useState } from "react";
import api from "../services/api";
import { motion } from "framer-motion";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    hourlyRate: 50,
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get("/clients");
    setClients(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/clients", form);
    setForm({ name: "", email: "", hourlyRate: 50, notes: "" });
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete client?")) return;
    await api.delete(`/clients/${id}`);
    load();
  };

  const updateField = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-950 via-gray-900 to-gray-950 text-gray-100 p-6">
      {" "}
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-cyan-900/30 transition-shadow"
        >
          {" "}
          <h2 className="text-3xl font-bold text-cyan-400 mb-2 flex items-center gap-2">
            {" "}
            <span className="bg-cyan-500/10 p-2 rounded-full">👥</span>
            Clients{" "}
          </h2>{" "}
          <p className="text-gray-400">
            Manage all your clients and their billing information here.
          </p>
        </motion.div>

        {/* Add Client Form */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-semibold text-cyan-400 mb-4 flex items-center gap-2">
            <span className="bg-cyan-500/10 p-2 rounded-full">➕</span>
            Add New Client
          </h3>

          <form className="grid md:grid-cols-2 gap-4" onSubmit={submit}>
            <div>
              <label className="block text-gray-300 text-sm mb-2">Name</label>
              <input
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Client name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">Email</label>
              <input
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="client@example.com"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Hourly Rate ($)
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Hourly rate"
                value={form.hourlyRate}
                onChange={(e) =>
                  updateField("hourlyRate", Number(e.target.value))
                }
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">Notes</label>
              <input
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="e.g. Shopify redesign project"
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-semibold rounded-lg transition-colors shadow-md"
              >
                Add Client
              </button>
            </div>
          </form>
        </motion.div>

        {/* Client List */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-lg overflow-x-auto"
        >
          <h3 className="text-xl font-semibold text-cyan-400 mb-4 flex items-center gap-2">
            <span className="bg-cyan-500/10 p-2 rounded-full">📋</span>
            Client List
          </h3>

          {loading ? (
            <p className="text-gray-500">Loading clients...</p>
          ) : clients.length > 0 ? (
            <table className="min-w-full text-sm text-gray-300">
              <thead className="bg-gray-800/60 text-gray-400 uppercase text-xs tracking-wide">
                <tr>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Rate</th>
                  <th className="py-3 px-4 text-left">Notes</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr
                    key={c._id}
                    className="border-b border-gray-800 hover:bg-gray-800/40 transition-colors"
                  >
                    <td className="py-2 px-4 font-medium text-cyan-300">
                      {c.name}
                    </td>
                    <td className="py-2 px-4">{c.email || "—"}</td>
                    <td className="py-2 px-4">
                      ${c.hourlyRate?.toFixed?.(2) ?? c.hourlyRate}
                    </td>
                    <td className="py-2 px-4 max-w-xs truncate">
                      {c.notes || "—"}
                    </td>
                    <td className="py-2 px-4 text-right">
                      <button
                        className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded-md text-sm text-white font-semibold transition-colors"
                        onClick={() => remove(c._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No clients added yet.</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
