import crypto from "crypto";
import Order from "../models/order.model.js";
import Customer from "../models/customer.model.js";
import Asset from "../models/asset.model.js";
import { razorpayInstance } from "../config/razorpay.js";
import { generateDownloadToken } from "../utils/signDownload.js";

export const createPaymentOrder = async (req, res) => {
  const { billingDetails } = req.body;
  if (!billingDetails?.fullName || !billingDetails?.email || !billingDetails?.phone) {
    return res.status(400).json({ success: false, error: "Valid billing details required" });
  }

  const customer = await Customer.findById(req.user._id).populate("cart.asset");
  if (!customer.cart.length) return res.status(400).json({ success: false, error: "Cart is empty" });

  let totalAmount = 0;
  const snapshotItems = [];

  for (const line of customer.cart) {
    const asset = line.asset;
    if (!asset || !asset.isPublished) return res.status(400).json({ success: false, error: "Asset no longer available" });
    const tier = asset.licenseTiers.find(t => t.name === line.licenseTier);
    if (!tier || (tier.remainingLicenses !== null && tier.remainingLicenses <= 0)) {
      return res.status(400).json({ success: false, error: `Tier ${line.licenseTier} for ${asset.title} unavailable` });
    }
    totalAmount += tier.price;
    snapshotItems.push({
      asset: asset._id,
      title: asset.title,
      licenseTier: tier.name,
      price: tier.price,
      thumbnailImage: asset.thumbnailImage,
    });
  }

  const rzpOrder = await razorpayInstance.orders.create({
    amount: Math.round(totalAmount * 100),
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
  });

  const order = await Order.create({
    user: req.user._id,
    items: snapshotItems,
    billingDetails,
    totalAmount,
    razorpayOrderId: rzpOrder.id,
    paymentStatus: "PENDING",
    status: "PENDING_PAYMENT",
  });

  res.status(201).json({
    success: true,
    data: { orderId: order._id, razorpayOrderId: rzpOrder.id, amount: rzpOrder.amount, currency: "INR" }
  });
};

export const verifyPayment = async (req, res) => {
  const { shopKartOrderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const order = await Order.findById(shopKartOrderId);
  if (!order || !order.user.equals(req.user._id)) {
    return res.status(403).json({ success: false, error: "Unauthorized order access" });
  }

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    .update(`${order.razorpayOrderId}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    order.paymentStatus = "FAILED";
    await order.save();
    return res.status(400).json({ success: false, error: "Invalid payment signature" });
  }

  order.paymentStatus = "PAID";
  order.status = "PLACED";
  order.razorpayPaymentId = razorpay_payment_id;
  await order.save();

  // Decrement remaining licenses for limited tiers
  for (const item of order.items) {
    await Asset.updateOne(
      { _id: item.asset, "licenseTiers.name": item.licenseTier, "licenseTiers.remainingLicenses": { $gt: 0 } },
      { $inc: { "licenseTiers.$.remainingLicenses": -1 } }
    );
  }

  // Clear customer's cart
  await Customer.findByIdAndUpdate(req.user._id, { cart: [] });

  res.status(200).json({ success: true, message: "Payment verified successfully", orderId: order._id });
};

export const getOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: orders.length, data: orders });
};

export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order || !order.user.equals(req.user._id)) {
    return res.status(404).json({ success: false, error: "Order not found" });
  }
  res.status(200).json({ success: true, data: order });
};

export const downloadAsset = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order || !order.user.equals(req.user._id) || order.paymentStatus !== "PAID") {
    return res.status(403).json({ success: false, error: "Access denied. Verified payment required." });
  }

  const item = order.items.find(i => i.asset.toString() === req.params.assetId);
  if (!item) return res.status(404).json({ success: false, error: "Asset not in this order" });

  const token = generateDownloadToken(order._id, item.asset, req.user._id);
  res.status(200).json({
    success: true,
    data: {
      assetTitle: item.title,
      licenseTier: item.licenseTier,
      downloadUrl: `/api/orders/${order._id}/download/${item.asset}?token=${token}`,
      expiresIn: "15 minutes"
    }
  });
};
