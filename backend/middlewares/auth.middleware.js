import jwt from "jsonwebtoken";
import Customer from "../models/customer.model.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ success: false, error: "Authentication required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Customer.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ success: false, error: "User session not found" });

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ success: false, error: "Invalid or expired session" });
  }
};

export default protect;
