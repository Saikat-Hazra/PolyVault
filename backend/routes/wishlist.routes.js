import { Router } from "express";
import { getWishlist, addToWishlist, removeFromWishlist } from "../controllers/wishlist.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(protect);

router.get("/", getWishlist);
router.post("/:assetId", addToWishlist);
router.delete("/:assetId", removeFromWishlist);

export default router;
