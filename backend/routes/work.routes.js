import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { startSession, stopSession, getSessions, updateSession, deleteSession, logManualSession } from "../controllers/work.controller.js";

const router = express.Router();
router.use(protect);

router.route("/").get(getSessions);
router.post("/start", startSession);
router.post("/manual", logManualSession);
router.post("/stop/:id", stopSession);
router.route("/:id").put(updateSession).delete(deleteSession);

export default router;
