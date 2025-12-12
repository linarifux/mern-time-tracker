import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Import directly

export default function Invoices() {
  const [clients, setClients] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [checked, setChecked] = useState({});
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      // Ensure your backend /invoices endpoint populates 'sessions' and 'clientId'
      const [cs, ss, inv] = await Promise.all([
        api.get("/clients").then((r) => r.data),
        api.get("/work").then((r) => r.data),
        api.get("/invoices").then((r) => r.data),
      ]);
      setClients(cs);
      // Only show sessions that are NOT already in an invoice (assuming your backend handles this filter, 
      // or you filter them here based on a 'invoiced' flag if your schema has it)
      setSessions(ss.filter((s) => s.totalHours && s.clientId));
      setInvoices(inv);
    } catch (e) {
      console.error("Error loading data", e);
    } finally {
      setLoading(false);
    }
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
    
    try {
      await api.post("/invoices", { clientId: selectedClient, sessionIds });
      setChecked({});
      await load();
      alert("Invoice created!");
    } catch (err) {
      console.error(err);
      alert("Failed to create invoice");
    }
  };

  const markAsPaid = async (invoice) => {
    // Prevent unchecking if already paid, or allow toggling? 
    // Usually once paid, it stays paid. Here we implement toggle for flexibility.
    const newStatus = invoice.status === "Paid" ? "Pending" : "Paid";
    try {
      // Assuming you have a PUT endpoint for updates
      await api.put(`/invoices/${invoice._id}`, { status: newStatus });
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const generatePDF = (invoice) => {
    try {
      console.log("Generating PDF for:", invoice);

      // 1. Safety Checks
      if (!invoice || !invoice.clientId) {
        alert("Error: Invoice data is incomplete (missing client details).");
        return;
      }
      
      const doc = new jsPDF();

      // -- Header --
      doc.setFontSize(22);
      doc.setTextColor(0, 150, 255); // Cyan
      doc.text("INVOICE", 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(100);
      
      const issueDate = new Date(invoice.issuedAt || invoice.createdAt);
      const dueDate = new Date(issueDate);
      dueDate.setDate(dueDate.getDate() + 5); 

      // Safe ID access
      const invId = invoice._id ? invoice._id.slice(-6).toUpperCase() : "---";
      
      doc.text(`Invoice ID: ${invId}`, 14, 30);
      doc.text(`Date Issued: ${issueDate.toLocaleDateString()}`, 14, 35);
      doc.text(`Due Date: ${dueDate.toLocaleDateString()}`, 14, 40);

      // -- Client Info --
      const clientName = invoice.clientId.name || "Client Name";
      // Fallback if rate isn't on client object (adjust based on your actual data structure)
      const clientRate = invoice.clientId.hourlyRate || 0; 

      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text(clientName, 200, 20, { align: "right" });
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Hourly Rate: $${clientRate}/hr`, 200, 28, { align: "right" });

      // -- Table Rows --
      // IMPORTANT: Check if sessions exist. If your backend sends just IDs, this will be empty.
      const sessions = invoice.sessions || [];
      
      const tableRows = sessions.map((session) => {
        // Handle case where session might be an ID string instead of an object
        if (typeof session === 'string') return ["-", "Session details not loaded", "-", "-", "-"];

        const date = new Date(session.startTime).toLocaleDateString();
        const notes = session.notes || "Work session";
        const hours = session.totalHours || 0;
        const amount = (hours * clientRate).toFixed(2);
        return [date, notes, hours.toFixed(2), `$${clientRate}`, `$${amount}`];
      });

      // Use the imported function directly
      autoTable(doc, {
        startY: 50,
        head: [["Date", "Description", "Hours", "Rate", "Total"]],
        body: tableRows,
        theme: "grid",
        headStyles: { fillColor: [0, 150, 255] },
        styles: { fontSize: 9 },
      });

      // -- Totals --
      // Use 'lastAutoTable' from the doc object, or calculate manually if needed
      const finalY = (doc.lastAutoTable?.finalY || 50) + 10;

      doc.setFontSize(10);
      doc.text(`Total Hours: ${invoice.totalHours?.toFixed(2) || 0}`, 140, finalY);

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`Total Bill: $${invoice.totalAmount?.toFixed(2) || 0}`, 140, finalY + 8);

      // Save
      doc.save(`Invoice_${clientName.replace(/\s+/g, '_')}.pdf`);
      
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Failed to generate PDF. Check console for details.");
    }
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
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Creation Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">Invoices</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-gray-300 text-sm mb-2">Select Client</label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="">All clients</option>
                {clients.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button
                onClick={createInvoice}
                className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-semibold rounded-lg transition-colors"
              >
                Create Invoice from Selected
              </button>
            </div>
          </div>
        </div>

        {/* Billable Sessions */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg overflow-x-auto">
          <h3 className="text-xl font-semibold text-cyan-400 mb-4">Billable Sessions</h3>
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
                <tr key={s._id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-2 px-3">
                    <input
                      type="checkbox"
                      checked={!!checked[s._id]}
                      onChange={() => toggle(s._id)}
                    />
                  </td>
                  <td className="py-2 px-3">{new Date(s.startTime).toLocaleString()}</td>
                  <td className="py-2 px-3">{s.clientId?.name}</td>
                  <td className="py-2 px-3">{s.totalHours?.toFixed?.(2) ?? s.totalHours}</td>
                  <td className="py-2 px-3 text-gray-300 truncate max-w-xs">{s.notes || "—"}</td>
                </tr>
              ))}
              {filteredSessions.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No sessions available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Existing Invoices */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg overflow-x-auto">
          <h3 className="text-xl font-semibold text-cyan-400 mb-4">Existing Invoices</h3>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400">
                <th className="py-2 px-3 text-left">Client</th>
                <th className="py-2 px-3 text-left">Amount</th>
                <th className="py-2 px-3 text-left">Issued</th>
                <th className="py-2 px-3 text-center">Paid</th>
                <th className="py-2 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv._id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-2 px-3">
                    <div className="font-medium text-gray-200">{inv.clientId?.name}</div>
                    <div className="text-xs text-gray-500">
                      {inv.sessions?.length || 0} sessions ({inv.totalHours?.toFixed(1)} hrs)
                    </div>
                  </td>
                  <td className="py-2 px-3 text-cyan-300 font-semibold">
                    ${inv.totalAmount?.toFixed?.(2) ?? inv.totalAmount}
                  </td>
                  <td className="py-2 px-3 text-gray-400">
                    {new Date(inv.issuedAt || inv.createdAt).toLocaleDateString()}
                  </td>
                  
                  {/* Mark as Paid Checkbox */}
                  <td className="py-2 px-3 text-center">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-gray-600 text-cyan-500 focus:ring-cyan-500 bg-gray-800"
                      checked={inv.status === "Paid"}
                      onChange={() => markAsPaid(inv)}
                    />
                  </td>

                  {/* Download PDF Button */}
                  <td className="py-2 px-3 text-right">
                    <button
                      onClick={() => generatePDF(inv)}
                      className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-cyan-400 border border-gray-700 rounded text-xs flex items-center gap-2 ml-auto transition-colors"
                    >
                      <span>⬇</span> PDF
                    </button>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No invoices generated yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {loading && <div className="text-center text-gray-500">Loading data...</div>}
      </div>
    </div>
  );
}