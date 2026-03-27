import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token;
    const appClientRaw = req.headers["x-app-client"];
    const appClient =
      typeof appClientRaw === "string" && appClientRaw.toLowerCase() === "admin"
        ? "admin"
        : "client";
    const preferredCookie =
      appClient === "admin" ? "admin_token" : "client_token";

    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token && req.cookies) {
      // Never allow admin cookies to authenticate client requests (and vice versa).
      token =
        req.cookies[preferredCookie] ||
        // Legacy cookie support scoped to the current client only.
        req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ msg: "No token, not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ msg: "User not found" });
    }

    next();
  } catch (error) {
    res.status(401).json({ msg: "Token failed" });
  }
};
