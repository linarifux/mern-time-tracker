import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";

// Components
import InvoiceCreationCard from "../components/invoices/InvoiceCreationCard";
import BillableSessionsTable from "../components/invoices/BillableSessionsTable";
import InvoiceHistoryTable from "../components/invoices/InvoiceHistoryTable";
import ConfirmationModal from "../components/modals/ConfirmationModal";
import AlertModal from "../components/modals/AlertModal"; // <--- Import AlertModal

export default function Invoices() {
  const [clients, setClients] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  
  const [selectedClient, setSelectedClient] = useState("");
  const [checked, setChecked] = useState({});
  const [activeTab, setActiveTab] = useState("billable");
  const [loading, setLoading] = useState(false);

  // UI States
  const [isCreating, setIsCreating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Modal States
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  
  // --- NEW: Alert Modal State ---
  const [alertState, setAlertState] = useState({ 
    isOpen: false, 
    title: "", 
    message: "", 
    type: "success" // 'success' or 'error'
  });

  // Monitor window size
  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // ... (Keep existing useMemo logic for sessions/totals) ...
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

  const toggle = (id) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  // --- HELPER: Trigger Custom Alert ---
  const showAlert = (title, message, type = "error") => {
    setAlertState({ isOpen: true, title, message, type });
  };

  // --- UPDATED CREATE FUNCTION ---
  const createInvoice = async () => {
    const sessionIds = Object.entries(checked).filter(([, v]) => v).map(([k]) => k);
    
    // 1. Validation using AlertModal
    if (!selectedClient) {
      return showAlert("Who is paying?", "Please select a client from the dropdown.", "error");
    }
    if (sessionIds.length === 0) {
      return showAlert("No Work Selected", "You can't bill for nothing! Check some boxes first.", "error");
    }

    setIsCreating(true);

    try {
      await new Promise(r => setTimeout(r, 1000)); // Animation delay
      await api.post("/invoices", { clientId: selectedClient, sessionIds });
      
      setChecked({});
      await load();
      
      // 2. Success using AlertModal + Confetti
      setShowConfetti(true);
      showAlert("Ka-ching! 💸", "Invoice generated successfully. Time to send it out!", "success");
      
      setTimeout(() => setShowConfetti(false), 5000); 

    } catch (err) {
      showAlert("Computer says no", "Failed to generate invoice. Please try again.", "error");
    } finally {
      setIsCreating(false);
    }
  };

  const markAsPaid = async (invoice) => {
    const newStatus = invoice.status === "Paid" ? "Pending" : "Paid";
    try {
      await api.put(`/invoices/${invoice._id}`, { status: newStatus });
      load();
    } catch (err) {
      showAlert("Error", "Failed to update status.");
    }
  };

  const confirmDelete = async () => {
    if (!invoiceToDelete) return;
    setInvoices((prev) => prev.filter((inv) => inv._id !== invoiceToDelete._id));
    setInvoiceToDelete(null); 
    try {
      await api.delete(`/invoices/${invoiceToDelete._id}`);
      load(); 
    } catch (err) {
      showAlert("Error", "Failed to delete invoice.");
      load(); 
    }
  };

  const generatePDF = (invoice) => {
    // ... (Keep existing PDF Logic) ...
    // Note: If error here, use showAlert("PDF Error", "Something went wrong")
    try {
        if (!invoice || !invoice.clientId) return showAlert("Error", "Data incomplete");
  
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.setTextColor(0, 150, 255);
        doc.text("INVOICE", 14, 20);
        
        const clientName = invoice.clientId.name || "Client";
        const clientRate = invoice.clientId.hourlyRate || 0;
        
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
        showAlert("Error", "PDF Machine Broken.");
      }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 overflow-hidden relative">
      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <Confetti 
            width={windowSize.width} 
            height={windowSize.height} 
            recycle={false} 
            numberOfPieces={500} 
            gravity={0.2}
          />
        </div>
      )}

      {/* Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        <InvoiceCreationCard 
          clients={clients}
          selectedClient={selectedClient}
          setSelectedClient={setSelectedClient}
          onCreate={createInvoice}
          disabled={activeTab === 'history'}
          isCreating={isCreating}
        />

        <BillableSessionsTable 
          sessions={displayedSessions}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          checked={checked}
          toggle={toggle}
          totals={totals}
        />

        <InvoiceHistoryTable 
          invoices={invoices}
          onMarkPaid={markAsPaid}
          onGeneratePDF={generatePDF}
          onDelete={(inv) => setInvoiceToDelete(inv)}
        />
        
        <AnimatePresence>
          {/* Delete Confirmation */}
          <ConfirmationModal
            isOpen={!!invoiceToDelete}
            onClose={() => setInvoiceToDelete(null)}
            onConfirm={confirmDelete}
            title="Shred this Invoice?"
            message={`Are you sure? This will return the sessions to the 'Billable' list.`}
          />

          {/* Success / Error Alerts */}
          <AlertModal
            isOpen={alertState.isOpen}
            onClose={() => setAlertState({ ...alertState, isOpen: false })}
            title={alertState.title}
            message={alertState.message}
            type={alertState.type}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}