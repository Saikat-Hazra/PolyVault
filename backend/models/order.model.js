import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  asset: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
  title: { type: String, required: true },
  licenseTier: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnailImage: { type: String, default: "" },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  items: [orderItemSchema],
  billingDetails: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    gstNumber: { type: String, default: "" },
  },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ["PENDING", "PAID", "FAILED"], default: "PENDING" },
  status: { type: String, enum: ["PENDING_PAYMENT", "PLACED", "DELIVERED"], default: "PENDING_PAYMENT" },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
