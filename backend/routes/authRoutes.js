import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
const isProduction = process.env.NODE_ENV === "production";

const getCookieName = (req) =>
  req.headers["x-app-client"] === "admin" ? "admin_token" : "client_token";

const getCookieOptions = () => ({
  httpOnly: true,
  sameSite: isProduction ? "none" : "lax",
  secure: isProduction,
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hash,
    });

    res.json({ msg: "Register success" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(400).json({ msg: "Invalid email" });

    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) return res.status(400).json({ msg: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const cookieName = getCookieName(req);
    res.cookie(cookieName, token, getCookieOptions());
    // Keep compatibility for older clients while rolling out.
    res.clearCookie("token", getCookieOptions());

    res.json({
      user: {
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post("/logout", (req, res) => {
  const cookieName = getCookieName(req);
  const options = getCookieOptions();

  res.clearCookie(cookieName, options);
  // Legacy cookie cleanup.
  res.clearCookie("token", options);
  res.json({ message: "Logged out" });
});

router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

export default router;
