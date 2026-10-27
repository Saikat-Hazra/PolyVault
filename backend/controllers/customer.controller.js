
import bcrypt from "bcryptjs";
import Customer from "../models/customer.model.js";
import { generateToken } from "../utils/generateToken.js";

// Helper: safely expose detailed errors only in development.
const sendServerError = (res, message, err) => {
  console.error(`❌ ${message}:`, err);

  return res.status(500).json({
    success: false,
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "An internal server error occurred. Please try again.",
  });
};

// ============================================
// REGISTER CUSTOMER
// POST /customers/register
// ============================================
export const register = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body ?? {};

    // Validate required fields.
    if (
      typeof fullName !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof phone !== "string" ||
      !fullName.trim() ||
      !email.trim() ||
      !password ||
      !phone.trim()
    ) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    const normalizedName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters",
      });
    }

    // Basic email format validation.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        error: "Please enter a valid email address",
      });
    }

    // Check whether the email is already registered.
    const existingCustomer = await Customer.findOne({
      email: normalizedEmail,
    });

    if (existingCustomer) {
      return res.status(409).json({
        success: false,
        error: "Email already registered",
      });
    }

    // Hash the password before saving it.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the customer.
    const customer = await Customer.create({
      fullName: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
      phone: normalizedPhone,
    });

    // Generate JWT and set the authentication cookie.
    generateToken(res, customer._id);

    // Return safe customer data. Never return the password or JWT.
    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: {
        id: customer._id,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        isCreator: customer.isCreator,
      },
    });
  } catch (err) {
    // Handle duplicate email race conditions.
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        error: "Email already registered",
      });
    }

    // Handle Mongoose schema validation errors.
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(
        (error) => error.message
      );

      return res.status(400).json({
        success: false,
        error: messages[0] || "Validation failed",
      });
    }

    // Handle missing JWT configuration explicitly.
    if (
      err.name === "Error" &&
      String(err.message).toLowerCase().includes("secret")
    ) {
      console.error(
        "❌ JWT configuration error. Check JWT_SECRET in backend/.env"
      );
    }

    // IMPORTANT: Print the complete error and stack trace.
    return sendServerError(res, "Register error", err);
  }
};

// ============================================
// LOGIN CUSTOMER
// POST /customers/login
// ============================================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Password is excluded from queries by default in the model.
    const customer = await Customer.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (
      !customer ||
      !(await bcrypt.compare(password, customer.password))
    ) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    generateToken(res, customer._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: customer._id,
        fullName: customer.fullName,
        email: customer.email,
        isCreator: customer.isCreator,
      },
    });
  } catch (err) {
    return sendServerError(res, "Login error", err);
  }
};

// ============================================
// GET CURRENT CUSTOMER
// GET /customers/me
// ============================================
export const getMe = (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (err) {
    return sendServerError(res, "GetMe error", err);
  }
};

// ============================================
// LOGOUT CUSTOMER
// POST /customers/logout
// ============================================
export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production" ? "strict" : "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    return sendServerError(res, "Logout error", err);
  }
};

// ============================================
// CHANGE CUSTOMER PASSWORD
// PATCH /customers/change-password
// ============================================
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body ?? {};

    if (
      typeof oldPassword !== "string" ||
      typeof newPassword !== "string" ||
      !oldPassword ||
      !newPassword
    ) {
      return res.status(400).json({
        success: false,
        error: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: "New password must be at least 6 characters",
      });
    }

    const customer = await Customer.findById(req.user?._id).select(
      "+password"
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: "Customer not found",
      });
    }

    const passwordMatches = await bcrypt.compare(
      oldPassword,
      customer.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        error: "Current password is incorrect",
      });
    }

    customer.password = await bcrypt.hash(newPassword, 10);
    await customer.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    return sendServerError(res, "ChangePassword error", err);
  }
};

// ============================================
// BECOME A CREATOR
// PATCH /customers/become-creator
// ============================================
export const becomeCreator = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.user?._id,
      { $set: { isCreator: true } },
      { new: true, runValidators: true }
    ).select("-password");

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: "Customer not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "You are now a creator",
      data: customer,
    });
  } catch (err) {
    return sendServerError(res, "BecomeCreator error", err);
  }
};
