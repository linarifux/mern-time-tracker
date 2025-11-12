import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  email: String,
  hourlyRate: { type: Number, default: 0 },
  notes: String,
}, { timestamps: true });

export default mongoose.model("Client", clientSchema);
