import { Router } from "express";
import { register, login, getMe, logout, changePassword, becomeCreator } from "../controllers/customer.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);
router.patch("/change-password", protect, changePassword);
router.patch("/become-creator", protect, becomeCreator);

export default router;
