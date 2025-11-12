import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { createInvoice, getInvoices } from "../controllers/invoice.controller.js";

const router = express.Router();
router.use(protect);

router.route("/").get(getInvoices).post(createInvoice);

export default router;
