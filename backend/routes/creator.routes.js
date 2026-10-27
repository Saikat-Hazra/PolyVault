import { Router } from "express";
import { getMyAssets, getMySales, getMyEarnings } from "../controllers/creator.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { requireCreator } from "../middlewares/creator.middleware.js";

const router = Router();

router.use(protect, requireCreator);

router.get("/assets", getMyAssets);
router.get("/sales", getMySales);
router.get("/earnings", getMyEarnings);

export default router;
