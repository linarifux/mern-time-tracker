import Invoice from "../models/invoice.models.js";
import WorkSession from "../models/workSession.models.js";
import Client from "../models/client.models.js";

export const createInvoice = async (req, res) => {
  const { clientId, sessionIds } = req.body;
  const sessions = await WorkSession.find({ _id: { $in: sessionIds } });
  const totalHours = sessions.reduce((sum, s) => sum + (s.totalHours || 0), 0);

  const client = await Client.findById(clientId);
  const totalAmount = totalHours * client.hourlyRate;

  const invoice = await Invoice.create({
    userId: req.user._id,
    clientId,
    sessions: sessionIds,
    totalHours,
    totalAmount
  });

  res.status(201).json(invoice);
};

// Backend: controllers/invoice.controller.js
export const getInvoices = async (req, res) => {
  const invoices = await Invoice.find({ userId: req.user._id })
    .populate("clientId")  // Get Client Name/Rate
    .populate("sessions"); // <--- VITAL: Get Session Details (notes, date, etc.)
    
  res.json(invoices);
};
