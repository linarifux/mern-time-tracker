import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

export default function Invoices() {
  const [clients, setClients] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [checked, setChecked] = useState({});
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const [cs, ss, inv] = await Promise.all([
      api.get("/clients").then((r) => r.data),
      api.get("/work").then((r) => r.data),
      api.get("/invoices").then((r) => r.data),
    ]);
    setClients(cs);
    setSessions(ss.filter((s) => s.totalHours && s.clientId));
    setInvoices(inv);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = (id) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const createInvoice = async () => {
    const sessionIds = Object.entries(checked)
      .filter(([, v]) => v)
      .map(([k]) => k);
    if (!selectedClient) return alert("Select a client");
    if (sessionIds.length === 0) return alert("Select at least one session");
    await api.post("/invoices", { clientId: selectedClient, sessionIds });
    setChecked({});
    await load();
    alert("Invoice created!");
  };

  const filteredSessions = useMemo(
    () =>
      sessions.filter(
        (s) => !selectedClient || s.clientId?._id === selectedClient
      ),
    [sessions, selectedClient]
  );

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 space-y-6">
      {" "}
      <div className="max-w-6xl mx-auto space-y-6">
        {" "}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
          {" "}
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">
            Invoices
          </h2>{" "}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            {" "}
            <div>
              {" "}
              <label className="block text-gray-300 text-sm mb-2">
                Select Client
              </label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                {" "}
                <option value="">All clients</option>
                {clients.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}{" "}
              </select>{" "}
            </div>{" "}
            <div className="sm:col-span-2 flex justify-end">
              {" "}
              <button
                onClick={createInvoice}
                className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-semibold rounded-lg transition-colors"
              >
                Create Invoice from Selected{" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
        </div>
        {/* Billable Sessions */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg overflow-x-auto">
          <h3 className="text-xl font-semibold text-cyan-400 mb-4">
            Billable Sessions
          </h3>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400">
                <th className="py-2 px-3 text-left"></th>
                <th className="py-2 px-3 text-left">Date</th>
                <th className="py-2 px-3 text-left">Client</th>
                <th className="py-2 px-3 text-left">Hours</th>
                <th className="py-2 px-3 text-left">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map((s) => (
                <tr
                  key={s._id}
                  className="border-b border-gray-800 hover:bg-gray-800/50"
                >
                  <td className="py-2 px-3">
                    <input
                      type="checkbox"
                      checked={!!checked[s._id]}
                      onChange={() => toggle(s._id)}
                    />
                  </td>
                  <td className="py-2 px-3">
                    {new Date(s.startTime).toLocaleString()}
                  </td>
                  <td className="py-2 px-3">{s.clientId?.name}</td>
                  <td className="py-2 px-3">
                    {s.totalHours?.toFixed?.(2) ?? s.totalHours}
                  </td>
                  <td className="py-2 px-3 text-gray-300">{s.notes || "—"}</td>
                </tr>
              ))}
              {filteredSessions.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No sessions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Existing Invoices */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg overflow-x-auto">
          <h3 className="text-xl font-semibold text-cyan-400 mb-4">
            Existing Invoices
          </h3>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400">
                <th className="py-2 px-3 text-left">Client</th>
                <th className="py-2 px-3 text-left">Total Hours</th>
                <th className="py-2 px-3 text-left">Amount</th>
                <th className="py-2 px-3 text-left">Status</th>
                <th className="py-2 px-3 text-left">Issued</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr
                  key={inv._id}
                  className="border-b border-gray-800 hover:bg-gray-800/50"
                >
                  <td className="py-2 px-3">{inv.clientId?.name}</td>
                  <td className="py-2 px-3">
                    {inv.totalHours?.toFixed?.(2) ?? inv.totalHours}
                  </td>
                  <td className="py-2 px-3 text-cyan-300 font-semibold">
                    ${inv.totalAmount?.toFixed?.(2) ?? inv.totalAmount}
                  </td>
                  <td className="py-2 px-3">
                    <span className="px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-300 text-xs">
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-gray-400">
                    {new Date(
                      inv.issuedAt || inv.createdAt
                    ).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No invoices yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {loading && <div className="text-center text-gray-500">Loading...</div>}
      </div>
    </div>
  );
}
