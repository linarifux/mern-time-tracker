import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: "WorkSession" }],
  totalHours: Number,
  totalAmount: Number,
  // CHANGED: "pending", "paid" -> "Pending", "Paid" (Matches Frontend)
  status: { type: String, enum: ["Pending", "Paid"], default: "Pending" },
  issuedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("Invoice", invoiceSchema);