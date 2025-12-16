import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
import crypto from "crypto"; // Built-in node module
import sendEmail from "../utils/sendEmail.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// --- REGISTER ---
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 1. Generate a random verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    
    // 2. Create user (isVerified will be false by default)
    const user = await User.create({
      name,
      email,
      password,
      verificationToken,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    // 3. Construct the verification URL
    // NOTE: This should point to your FRONTEND page, which will then call the backend API
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    // 4. Send Email
    const message = `
      <h1>Email Verification</h1>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verifyUrl}" clicktracking=off>${verifyUrl}</a>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Verify your account",
        message,
      });

      // 5. Respond without logging them in
      res.status(201).json({
        message: "Registration successful. Please check your email to verify your account.",
      });
    } catch (error) {
      // If email fails, delete the user so they can try again
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({ message: "Email could not be sent. Please try again." });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- LOGIN ---
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    
    // Check if verified
    if (!user.isVerified) {
      return res.status(401).json({ message: "Please verify your email before logging in." });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

// --- NEW: VERIFY EMAIL ---
export const verifyEmail = async (req, res) => {
  const { token } = req.body; // Or req.params, depending on your route setup

  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: Date.now() }, // Check if token is not expired
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  // Update user status
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  res.json({ message: "Email verified successfully. You can now login." });
};