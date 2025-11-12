import mongoose from "mongoose";

const workSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  startTime: { type: Date, required: true },
  endTime: Date,
  totalHours: Number,
  notes: String,
  tag: String,
}, { timestamps: true });

export default mongoose.model("WorkSession", workSessionSchema);
