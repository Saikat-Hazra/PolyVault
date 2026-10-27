import Customer from "../models/customer.model.js";
import Asset from "../models/asset.model.js";

export const getCart = async (req, res) => {
  const customer = await Customer.findById(req.user._id).populate("cart.asset");
  const validCart = [];

  for (const item of customer.cart) {
    if (item.asset && item.asset.isPublished) {
      const tier = item.asset.licenseTiers.find(t => t.name === item.licenseTier);
      if (tier) {
        validCart.push({
          asset: item.asset,
          licenseTier: item.licenseTier,
          price: tier.price,
          remainingLicenses: tier.remainingLicenses
        });
      }
    }
  }

  const subtotal = validCart.reduce((sum, item) => sum + item.price, 0);
  res.status(200).json({ success: true, count: validCart.length, subtotal, data: validCart });
};

export const addToCart = async (req, res) => {
  const { licenseTier } = req.body;
  const asset = await Asset.findById(req.params.assetId);
  if (!asset || !asset.isPublished) return res.status(404).json({ success: false, error: "Asset not found" });

  const tier = asset.licenseTiers.find(t => t.name === licenseTier);
  if (!tier) return res.status(400).json({ success: false, error: "Invalid license tier selected" });
  if (tier.remainingLicenses !== null && tier.remainingLicenses <= 0) {
    return res.status(400).json({ success: false, error: "Selected license tier is sold out" });
  }

  const customer = await Customer.findById(req.user._id);
  const existingIndex = customer.cart.findIndex(c => c.asset.equals(asset._id));

  if (existingIndex > -1) {
    customer.cart[existingIndex].licenseTier = licenseTier; // Replace tier, don't stack
  } else {
    customer.cart.push({ asset: asset._id, licenseTier });
  }

  await customer.save();
  res.status(200).json({ success: true, message: "Cart updated", cart: customer.cart });
};

export const updateCart = async (req, res) => {
  const { licenseTier } = req.body;
  const customer = await Customer.findById(req.user._id);
  const line = customer.cart.find(c => c.asset.toString() === req.params.assetId);
  if (!line) return res.status(404).json({ success: false, error: "Item not in cart" });

  const asset = await Asset.findById(req.params.assetId);
  const tier = asset?.licenseTiers.find(t => t.name === licenseTier);
  if (!tier) return res.status(400).json({ success: false, error: "Invalid license tier" });

  line.licenseTier = licenseTier;
  await customer.save();
  res.status(200).json({ success: true, message: "License tier changed" });
};

export const removeFromCart = async (req, res) => {
  await Customer.findByIdAndUpdate(req.user._id, {
    $pull: { cart: { asset: req.params.assetId } }
  });
  res.status(200).json({ success: true, message: "Item removed from cart" });
};
