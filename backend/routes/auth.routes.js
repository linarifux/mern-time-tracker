import express from "express";
import { registerUser, loginUser, verifyEmail } from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-email", verifyEmail);

export default router;
