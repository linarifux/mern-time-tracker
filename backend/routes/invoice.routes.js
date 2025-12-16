import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { createInvoice, getInvoices, updateInvoice } from "../controllers/invoice.controller.js";

const router = express.Router();
router.use(protect);

router.route("/").get(getInvoices).post(createInvoice);
router.put("/:id", updateInvoice);

export default router;
