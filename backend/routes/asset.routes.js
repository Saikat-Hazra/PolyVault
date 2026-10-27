import { Router } from "express";
import { getCategories, getAssets, getAssetById, createAsset, updateAsset, deleteAsset } from "../controllers/asset.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { requireCreator } from "../middlewares/creator.middleware.js";

const router = Router();

// STATIC ROUTE FIRST - prevents "categories" from matching ":id"
router.get("/categories", getCategories);

router.get("/", getAssets);
router.get("/:id", getAssetById);

// Creator routes
router.post("/", protect, requireCreator, createAsset);
router.patch("/:id", protect, requireCreator, updateAsset);
router.delete("/:id", protect, requireCreator, deleteAsset);

export default router;
