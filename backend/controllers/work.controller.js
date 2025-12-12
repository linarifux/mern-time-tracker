import WorkSession from "../models/workSession.models.js";


// ... existing startSession ...
export const startSession = async (req, res) => {
  const { clientId, tag } = req.body;
  const session = await WorkSession.create({
    userId: req.user._id,
    clientId,
    startTime: new Date(),
    tag,
    isManual: false
  });
  res.status(201).json(session);
};

// ... existing stopSession ... 
// (No changes needed here, assuming stopSession is only for timer-based)

// --- NEW FUNCTION ---
export const logManualSession = async (req, res) => {
  try {
    const { clientId, tag, notes, totalHours, date } = req.body;

    // Validate required fields
    if (!clientId || !totalHours) {
      return res.status(400).json({ message: "Client and Total Hours are required." });
    }

    // Determine the date for the entry (default to now if not provided)
    const entryDate = date ? new Date(date) : new Date();

    // Optional: Calculate an artificial endTime so your data stays consistent
    // (e.g., if start is 10:00 AM and hours is 2, end is 12:00 PM)
    // This helps if you use a calendar view later.
    const calculatedEndTime = new Date(entryDate.getTime() + (totalHours * 60 * 60 * 1000));

    const session = await WorkSession.create({
      userId: req.user._id,
      clientId,
      tag,
      notes,
      startTime: entryDate,       // Acts as the "Date" of the log
      endTime: calculatedEndTime, // Kept consistent with hours
      totalHours: Number(totalHours),
      isManual: true
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: "Error creating manual session", error: error.message });
  }
};

// ... existing getSessions, updateSession, deleteSession ...

export const stopSession = async (req, res) => {
  const session = await WorkSession.findById(req.params.id);
  if (!session) return res.status(404).json({ message: "Session not found" });

  session.endTime = new Date();
  const hours = (session.endTime - session.startTime) / (1000 * 60 * 60);
  session.totalHours = Number(hours.toFixed(2));
  await session.save();

  res.json(session);
};

export const getSessions = async (req, res) => {
  const sessions = await WorkSession.find({ userId: req.user._id }).populate("clientId");
  res.json(sessions);
};

export const updateSession = async (req, res) => {
  const session = await WorkSession.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(session);
};

export const deleteSession = async (req, res) => {
  await WorkSession.findByIdAndDelete(req.params.id);
  res.json({ message: "Session deleted" });
};
