import mongoose from "mongoose";

const workSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  // Made optional to allow flexible manual entry (though we will usually populate it)
  startTime: { type: Date }, 
  endTime: Date,
  totalHours: Number, // We will insert this directly for manual entries
  notes: String,
  tag: String,
  isManual: { type: Boolean, default: false } // Useful to distinguish timer vs manual logs later
}, { timestamps: true });

export default mongoose.model("WorkSession", workSessionSchema);