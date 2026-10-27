import Asset from "../models/asset.model.js";
import Order from "../models/order.model.js";

export const getMyAssets = async (req, res) => {
  const assets = await Asset.find({ creator: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: assets.length, data: assets });
};

export const getMySales = async (req, res) => {
  const myAssetIds = await Asset.find({ creator: req.user._id }).distinct("_id");
  const orders = await Order.find({
    paymentStatus: "PAID",
    "items.asset": { $in: myAssetIds }
  }).sort({ createdAt: -1 });

  const sales = orders.flatMap(order =>
    order.items
      .filter(item => myAssetIds.some(id => id.equals(item.asset)))
      .map(item => ({
        orderId: order._id,
        createdAt: order.createdAt,
        title: item.title,
        licenseTier: item.licenseTier,
        price: item.price,
      }))
  );

  res.status(200).json({ success: true, count: sales.length, data: sales });
};

export const getMyEarnings = async (req, res) => {
  const myAssetIds = await Asset.find({ creator: req.user._id }).distinct("_id");
  const orders = await Order.find({
    paymentStatus: "PAID",
    "items.asset": { $in: myAssetIds }
  });

  const totalEarned = orders.reduce((sum, order) => {
    const assetSum = order.items
      .filter(item => myAssetIds.some(id => id.equals(item.asset)))
      .reduce((sub, item) => sub + item.price, 0);
    return sum + assetSum;
  }, 0);

  res.status(200).json({ success: true, data: { totalEarned, currency: "INR" } });
};
