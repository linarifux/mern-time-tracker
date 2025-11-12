import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: "WorkSession" }],
  totalHours: Number,
  totalAmount: Number,
  status: { type: String, enum: ["pending", "paid"], default: "pending" },
  issuedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("Invoice", invoiceSchema);
