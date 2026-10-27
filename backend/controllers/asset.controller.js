import Asset from "../models/asset.model.js";
import Order from "../models/order.model.js";

export const getCategories = (req, res) => {
  res.status(200).json({
    success: true,
    data: ["Character", "Prop", "Environment", "HDRI", "Material"]
  });
};

export const getAssets = async (req, res) => {
  const { search, category, format, minPrice, maxPrice, minPolycount, maxPolycount } = req.query;
  const filter = { isPublished: true };

  if (search) filter.title = { $regex: search, $options: "i" };
  if (category) filter.category = category;
  if (format) filter.fileFormats = format;
  if (minPolycount || maxPolycount) {
    filter.polycount = {};
    if (minPolycount) filter.polycount.$gte = Number(minPolycount);
    if (maxPolycount) filter.polycount.$lte = Number(maxPolycount);
  }
  if (minPrice || maxPrice) {
    filter["licenseTiers.price"] = {};
    if (minPrice) filter["licenseTiers.price"].$gte = Number(minPrice);
    if (maxPrice) filter["licenseTiers.price"].$lte = Number(maxPrice);
  }

  const assets = await Asset.find(filter).populate("creator", "fullName email");
  res.status(200).json({ success: true, count: assets.length, data: assets });
};

export const getAssetById = async (req, res) => {
  const asset = await Asset.findOne({ _id: req.params.id, isPublished: true }).populate("creator", "fullName email");
  if (!asset) return res.status(404).json({ success: false, error: "Asset not found" });
  res.status(200).json({ success: true, data: asset });
};

export const createAsset = async (req, res) => {
  const { title, description, category, fileFormats, polycount, thumbnailImage, previewModelUrl, filePath, licenseTiers } = req.body;
  if (!title || !category || !licenseTiers || licenseTiers.length === 0) {
    return res.status(400).json({ success: false, error: "Missing required asset details or license tiers" });
  }

  const asset = await Asset.create({
    title, description, category, fileFormats, polycount,
    thumbnailImage, previewModelUrl, filePath, licenseTiers,
    creator: req.user._id,
  });
  res.status(201).json({ success: true, data: asset });
};

export const updateAsset = async (req, res) => {
  const asset = await Asset.findById(req.params.id);
  if (!asset) return res.status(404).json({ success: false, error: "Asset not found" });
  if (!asset.creator.equals(req.user._id)) {
    return res.status(403).json({ success: false, error: "Unauthorized: You do not own this asset" });
  }

  Object.assign(asset, req.body);
  await asset.save();
  res.status(200).json({ success: true, data: asset });
};

export const deleteAsset = async (req, res) => {
  const asset = await Asset.findById(req.params.id);
  if (!asset) return res.status(404).json({ success: false, error: "Asset not found" });
  if (!asset.creator.equals(req.user._id)) {
    return res.status(403).json({ success: false, error: "Unauthorized: You do not own this asset" });
  }

  const existingOrders = await Order.countDocuments({ "items.asset": asset._id });
  if (existingOrders > 0) {
    return res.status(409).json({ success: false, error: "Cannot delete asset with existing order records. Unlist instead." });
  }

  await asset.deleteOne();
  res.status(200).json({ success: true, message: "Asset deleted successfully" });
};
