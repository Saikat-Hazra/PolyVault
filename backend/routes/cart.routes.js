import { Router } from "express";
import { getCart, addToCart, updateCart, removeFromCart } from "../controllers/cart.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(protect);

router.get("/", getCart);
router.post("/:assetId", addToCart);
router.patch("/:assetId", updateCart);
router.delete("/:assetId", removeFromCart);

export default router;
