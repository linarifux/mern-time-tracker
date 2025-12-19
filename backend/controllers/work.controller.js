import WorkSession from "../models/workSession.models.js";

// --- START SESSION ---
export const startSession = async (req, res) => {
  try {
    const { clientId, tag, notes } = req.body;
    
    // Basic validation
    if (!clientId) {
      return res.status(400).json({ message: "Client ID is required" });
    }

    const session = await WorkSession.create({
      userId: req.user._id,
      clientId,
      startTime: new Date(),
      tag,
      notes,
      isManual: false
    });
    
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: "Error starting session", error: error.message });
  }
};

// --- LOG MANUAL SESSION ---
export const logManualSession = async (req, res) => {
  try {
    const { clientId, tag, notes, totalHours, date } = req.body;

    // Validate required fields
    if (!clientId || !totalHours) {
      return res.status(400).json({ message: "Client and Total Hours are required." });
    }

    // Determine the date for the entry (default to now if not provided)
    const entryDate = date ? new Date(date) : new Date();

    // Calculate an artificial endTime so data stays consistent
    const calculatedEndTime = new Date(entryDate.getTime() + (totalHours * 60 * 60 * 1000));

    const session = await WorkSession.create({
      userId: req.user._id,
      clientId,
      tag,
      notes,
      startTime: entryDate,       
      endTime: calculatedEndTime, 
      totalHours: Number(totalHours),
      isManual: true
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: "Error creating manual session", error: error.message });
  }
};

// --- STOP SESSION ---
export const stopSession = async (req, res) => {
  try {
    const session = await WorkSession.findById(req.params.id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    // Prevent stopping a session that's already stopped (optional safeguard)
    if (session.endTime) {
       return res.status(400).json({ message: "Session is already stopped" });
    }

    session.endTime = new Date();
    const hours = (session.endTime - session.startTime) / (1000 * 60 * 60);
    session.totalHours = Number(hours.toFixed(2));
    
    // Update notes if provided during stop
    if (req.body.notes) session.notes = req.body.notes;
    
    await session.save();

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: "Error stopping session", error: error.message });
  }
};

// --- GET SESSIONS ---
export const getSessions = async (req, res) => {
  try {
    const sessions = await WorkSession.find({ userId: req.user._id })
      .populate("clientId")
      .sort({ startTime: -1 }); // Optional: sort by newest first
      
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sessions", error: error.message });
  }
};

// --- UPDATE SESSION ---
export const updateSession = async (req, res) => {
  try {
    const session = await WorkSession.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    
    if (!session) return res.status(404).json({ message: "Session not found" });
    
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: "Error updating session", error: error.message });
  }
};

// --- DELETE SESSION ---
export const deleteSession = async (req, res) => {
  try {
    const session = await WorkSession.findByIdAndDelete(req.params.id);
    
    if (!session) return res.status(404).json({ message: "Session not found" });
    
    res.json({ message: "Session deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting session", error: error.message });
  }
};