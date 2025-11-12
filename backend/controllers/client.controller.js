import Client from "../models/client.models.js";

export const createClient = async (req, res) => {
  const { name, email, hourlyRate, notes } = req.body;
  const client = await Client.create({
    userId: req.user._id,
    name, email, hourlyRate, notes
  });
  res.status(201).json(client);
};

export const getClients = async (req, res) => {
  const clients = await Client.find({ userId: req.user._id });
  res.json(clients);
};

export const updateClient = async (req, res) => {
  const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(client);
};

export const deleteClient = async (req, res) => {
  await Client.findByIdAndDelete(req.params.id);
  res.json({ message: "Client deleted" });
};
