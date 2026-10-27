import mongoose from "mongoose";
import dotenv from "dotenv";
import Asset from "../models/asset.model.js";
import Customer from "../models/customer.model.js";

dotenv.config();

const demoAssets = [
  {
    title: "Apex Recon Cyber Mech",
    description: "Production-ready hard-surface sci-fi mechanical biped with rig and 4K PBR textures.",
    category: "Character",
    fileFormats: [".blend", ".fbx"],
    polycount: 48200,
    thumbnailImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    previewModelUrl: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb",
    licenseTiers: [
      { name: "Personal", price: 499, remainingLicenses: null },
      { name: "Commercial", price: 1499, remainingLicenses: 25 },
      { name: "Extended", price: 4999, remainingLicenses: 5 },
    ],
  },
  {
    title: "Ancient Runebound Claymore",
    description: "Fantasy hero asset featuring glowing Nordic runes, baked normal maps, and stylized hand-painted textures.",
    category: "Prop",
    fileFormats: [".blend", ".fbx", ".obj"],
    polycount: 8640,
    thumbnailImage: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=80",
    previewModelUrl: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF-Binary/Box.glb",
    licenseTiers: [
      { name: "Personal", price: 299, remainingLicenses: null },
      { name: "Commercial", price: 899, remainingLicenses: null },
      { name: "Extended", price: 2499, remainingLicenses: 10 },
    ],
  },
  {
    title: "Abandoned Neon Cyberpunk Alley",
    description: "Modular street environment kit including neon signs, AC units, dumpsters, and puddles with SSR setup.",
    category: "Environment",
    fileFormats: [".blend", ".fbx"],
    polycount: 124000,
    thumbnailImage: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80",
    previewModelUrl: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb",
    licenseTiers: [
      { name: "Personal", price: 999, remainingLicenses: null },
      { name: "Commercial", price: 2999, remainingLicenses: 15 },
      { name: "Extended", price: 8999, remainingLicenses: 3 },
    ],
  },
];

export const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    let creator = await Customer.findOne({ isCreator: true });
    if (!creator) {
      creator = await Customer.create({
        fullName: "Demo 3D Artisan",
        email: "artisan@polyvault.internal",
        password: "hashed_dummy_password",
        phone: "9876543210",
        isCreator: true,
      });
    }

    await Asset.deleteMany({});
    const assetsWithCreator = demoAssets.map(a => ({ ...a, creator: creator._id }));
    await Asset.insertMany(assetsWithCreator);

    console.log(`Successfully seeded ${demoAssets.length} 3D assets!`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

if (process.argv[1]?.endsWith("seedAssets.js")) {
  seed();
}
