import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { createClient, getClients, updateClient, deleteClient } from "../controllers/client.controller.js";

const router = express.Router();
router.use(protect);

router.route("/").get(getClients).post(createClient);
router.route("/:id").put(updateClient).delete(deleteClient);

export default router;
