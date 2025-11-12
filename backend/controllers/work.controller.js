import WorkSession from "../models/workSession.models.js";

export const startSession = async (req, res) => {
  const { clientId, tag } = req.body;
  const session = await WorkSession.create({
    userId: req.user._id,
    clientId,
    startTime: new Date(),
    tag
  });
  res.status(201).json(session);
};

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
