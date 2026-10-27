import mongoose from "mongoose";

const cartLineSchema = new mongoose.Schema({
  asset: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
  licenseTier: { type: String, required: true },
}, { _id: false });

const customerSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  phone: { type: String, required: true, trim: true },
  isCreator: { type: Boolean, default: false },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Asset" }],
  cart: [cartLineSchema],
}, { timestamps: true });

export default mongoose.model("Customer", customerSchema);
