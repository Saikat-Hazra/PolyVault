import Customer from "../models/customer.model.js";
import Asset from "../models/asset.model.js";

export const getWishlist = async (req, res) => {
  const customer = await Customer.findById(req.user._id).populate({
    path: "wishlist",
    match: { isPublished: true },
    populate: { path: "creator", select: "fullName email" }
  });
  res.status(200).json({ success: true, data: customer.wishlist || [] });
};

export const addToWishlist = async (req, res) => {
  const asset = await Asset.findById(req.params.assetId);
  if (!asset) return res.status(404).json({ success: false, error: "Asset not found" });

  await Customer.findByIdAndUpdate(req.user._id, {
    $addToSet: { wishlist: asset._id }
  });
  res.status(200).json({ success: true, message: "Asset added to wishlist" });
};

export const removeFromWishlist = async (req, res) => {
  await Customer.findByIdAndUpdate(req.user._id, {
    $pull: { wishlist: req.params.assetId }
  });
  res.status(200).json({ success: true, message: "Asset removed from wishlist" });
};
