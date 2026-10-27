import mongoose from "mongoose";

const licenseTierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  remainingLicenses: { type: Number, default: null },
}, { _id: false });

const assetSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ["Character", "Prop", "Environment", "HDRI", "Material"] 
  },
  fileFormats: [{ type: String }],
  polycount: { type: Number, min: 0, default: 0 },
  thumbnailImage: { type: String, default: "" },
  previewModelUrl: { type: String, default: "" },
  filePath: { type: String, select: false },
  licenseTiers: { type: [licenseTierSchema], validate: [v => v.length > 0, "At least one tier required"] },
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("Asset", assetSchema);
