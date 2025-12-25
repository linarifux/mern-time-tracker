import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Components
import InvoiceCreationCard from "../components/invoices/InvoiceCreationCard";
import BillableSessionsTable from "../components/invoices/BillableSessionsTable";
import InvoiceHistoryTable from "../components/invoices/InvoiceHistoryTable";

export default function Invoices() {
  const [clients, setClients] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  
  const [selectedClient, setSelectedClient] = useState("");
  const [checked, setChecked] = useState({});
  const [activeTab, setActiveTab] = useState("billable");
  const [loading, setLoading] = useState(false);

  // --- Data Loading ---
  const load = async () => {
    setLoading(true);
    try {
      const [cs, ss, inv] = await Promise.all([
        api.get("/clients").then((r) => r.data),
        api.get("/work").then((r) => r.data),
        api.get("/invoices").then((r) => r.data),
      ]);
      setClients(cs);
      setSessions(ss.filter((s) => s.totalHours && s.clientId));
      setInvoices(inv);
    } catch (e) {
      console.error("Error loading data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // --- Logic: Identify Invoiced Sessions ---
  const invoicedSessionIds = useMemo(() => {
    const ids = new Set();
    invoices.forEach((inv) => {
      if (inv.sessions) {
        inv.sessions.forEach((s) => {
          const id = typeof s === "string" ? s : s._id;
          if (id) ids.add(id);
        });
      }
    });
    return ids;
  }, [invoices]);

  // --- Logic: Filter Sessions for Table ---
  const displayedSessions = useMemo(() => {
    let filtered = sessions.filter(
      (s) => !selectedClient || s.clientId?._id === selectedClient
    );

    if (activeTab === "billable") {
      return filtered.filter((s) => !invoicedSessionIds.has(s._id));
    } else {
      return filtered.filter((s) => invoicedSessionIds.has(s._id));
    }
  }, [sessions, selectedClient, invoicedSessionIds, activeTab]);

  // --- Logic: Calculate Totals ---
  const totals = useMemo(() => {
    return displayedSessions.reduce(
      (acc, s) => {
        const hours = s.totalHours || 0;
        const rate = s.clientId?.rate || s.clientId?.hourlyRate || 0; 
        acc.hours += hours;
        acc.amount += hours * rate;
        return acc;
      },
      { hours: 0, amount: 0 }
    );
  }, [displayedSessions]);

  // --- Actions ---
  const toggle = (id) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const createInvoice = async () => {
    const sessionIds = Object.entries(checked).filter(([, v]) => v).map(([k]) => k);
    if (!selectedClient) return alert("Hey! Who are we charging? Select a client.");
    if (sessionIds.length === 0) return alert("You can't bill for nothing! Select some work.");

    try {
      await api.post("/invoices", { clientId: selectedClient, sessionIds });
      setChecked({});
      await load();
      alert("Ka-ching! Invoice created.");
    } catch (err) {
      alert("Failed to create invoice. Computer says no.");
    }
  };

  const markAsPaid = async (invoice) => {
    const newStatus = invoice.status === "Paid" ? "Pending" : "Paid";
    try {
      await api.put(`/invoices/${invoice._id}`, { status: newStatus });
      load();
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const generatePDF = (invoice) => {
    try {
      if (!invoice || !invoice.clientId) return alert("Data incomplete.");

      const doc = new jsPDF();
      
      // ... (Same PDF Logic as before, kept concise here for brevity)
      doc.setFontSize(22);
      doc.setTextColor(0, 150, 255);
      doc.text("INVOICE", 14, 20);
      
      const clientName = invoice.clientId.name || "Client";
      const clientRate = invoice.clientId.hourlyRate || 0;
      
      // Table
      const tableRows = (invoice.sessions || []).map((s) => {
         if (typeof s === 'string') return ["-", "-", "-", "-", "-"];
         return [
           new Date(s.startTime).toLocaleDateString(),
           s.notes || "-",
           s.totalHours,
           `$${clientRate}`,
           `$${(s.totalHours * clientRate).toFixed(2)}`
         ];
      });

      autoTable(doc, {
        startY: 50,
        head: [["Date", "Work", "Hrs", "Rate", "Total"]],
        body: tableRows,
        theme: "grid",
        headStyles: { fillColor: [0, 150, 255] }
      });

      const finalY = (doc.lastAutoTable?.finalY || 50) + 10;
      doc.text(`Total Due: $${invoice.totalAmount?.toFixed(2)}`, 140, finalY + 10);
      
      doc.save(`Invoice_${clientName}.pdf`);
    } catch (error) {
      console.error(error);
      alert("PDF Machine Broken.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* Component 1: Create */}
        <InvoiceCreationCard 
          clients={clients}
          selectedClient={selectedClient}
          setSelectedClient={setSelectedClient}
          onCreate={createInvoice}
          disabled={activeTab === 'history'}
        />

        {/* Component 2: Session List */}
        <BillableSessionsTable 
          sessions={displayedSessions}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          checked={checked}
          toggle={toggle}
          totals={totals}
        />

        {/* Component 3: History */}
        <InvoiceHistoryTable 
          invoices={invoices}
          onMarkPaid={markAsPaid}
          onGeneratePDF={generatePDF}
        />
        
      </div>
    </div>
  );
}