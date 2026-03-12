import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token;
    const appClient = req.headers["x-app-client"];
    const preferredCookie = appClient === "admin" ? "admin_token" : "client_token";

    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token && req.cookies) {
      token =
        req.cookies[preferredCookie] ||
        req.cookies.token ||
        req.cookies.client_token ||
        req.cookies.admin_token;
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
