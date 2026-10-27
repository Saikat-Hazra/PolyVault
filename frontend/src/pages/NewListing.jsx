import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { ArrowLeft, Plus, Trash2, Box } from "lucide-react";

export const NewListing = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Character",
    fileFormats: ".blend, .fbx",
    polycount: 24000,
    thumbnailImage: "",
    previewModelUrl: "",
    filePath: "private/assets/sample_archive.zip",
    licenseTiers: [
      { name: "Personal", price: 499, remainingLicenses: "" },
      { name: "Commercial", price: 1499, remainingLicenses: "50" },
      { name: "Extended", price: 3999, remainingLicenses: "10" },
    ],
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleTierChange = (index, field, value) => {
    const updated = [...formData.licenseTiers];
    updated[index][field] = value;
    setFormData({ ...formData, licenseTiers: updated });
  };

  const addTier = () => {
    setFormData({
      ...formData,
      licenseTiers: [...formData.licenseTiers, { name: "", price: 999, remainingLicenses: "" }],
    });
  };

  const removeTier = (index) => {
    if (formData.licenseTiers.length <= 1) return;
    setFormData({
      ...formData,
      licenseTiers: formData.licenseTiers.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        polycount: Number(formData.polycount) || 0,
        fileFormats: formData.fileFormats.split(",").map((s) => s.trim()),
        licenseTiers: formData.licenseTiers.map((t) => ({
          name: t.name,
          price: Number(t.price),
          remainingLicenses: t.remainingLicenses === "" ? null : Number(t.remainingLicenses),
        })),
      };

      await api.post("/assets", payload);
      navigate("/creator/listings");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 bg-white dark:bg-[#16181D]">
      <Link
        to="/creator/listings"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-vault-muted hover:text-vault-dark mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Listings
      </Link>

      <div className="border-b border-vault-border pb-6 mb-8">
        <span className="text-xs font-mono uppercase tracking-widest text-vault-accent font-semibold block mb-1">
          Creator Studio
        </span>
        <h1 className="font-serif text-3xl font-bold text-vault-dark">Upload & Publish 3D Asset</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#16181D] p-6 sm:p-8 rounded-lg border border-vault-border dark:border-neutral-800 space-y-6 shadow-craft">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-vault-muted mb-1">
            Asset Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-neutral-50 border border-vault-border rounded focus:outline-none focus:ring-1 focus:ring-vault-accent"
            placeholder="e.g. Scifi Drone Model (Rigged)"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-vault-muted mb-1">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-neutral-50 border border-vault-border rounded focus:outline-none focus:ring-1 focus:ring-vault-accent"
            >
              <option value="Character">Character</option>
              <option value="Prop">Prop</option>
              <option value="Environment">Environment</option>
              <option value="HDRI">HDRI</option>
              <option value="Material">Material</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-vault-muted mb-1">
              Polygon Count
            </label>
            <input
              type="number"
              min="0"
              value={formData.polycount}
              onChange={(e) => setFormData({ ...formData, polycount: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-neutral-50 border border-vault-border rounded focus:outline-none focus:ring-1 focus:ring-vault-accent"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-vault-muted mb-1">
            File Formats (Comma separated)
          </label>
          <input
            type="text"
            value={formData.fileFormats}
            onChange={(e) => setFormData({ ...formData, fileFormats: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-neutral-50 border border-vault-border rounded focus:outline-none focus:ring-1 focus:ring-vault-accent"
            placeholder=".blend, .fbx, .obj"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-vault-muted mb-1">
            Description
          </label>
          <textarea
            rows="3"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-neutral-50 border border-vault-border rounded focus:outline-none focus:ring-1 focus:ring-vault-accent"
            placeholder="Details about mesh topology, texturing, rigging, and blender version..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-vault-muted mb-1">
              Thumbnail Image URL
            </label>
            <input
              type="url"
              value={formData.thumbnailImage}
              onChange={(e) => setFormData({ ...formData, thumbnailImage: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-neutral-50 border border-vault-border rounded focus:outline-none focus:ring-1 focus:ring-vault-accent"
              placeholder="https://.../thumbnail.jpg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-vault-muted mb-1">
              Preview Model URL (.glb)
            </label>
            <input
              type="url"
              value={formData.previewModelUrl}
              onChange={(e) => setFormData({ ...formData, previewModelUrl: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-neutral-50 border border-vault-border rounded focus:outline-none focus:ring-1 focus:ring-vault-accent"
              placeholder="https://.../preview.glb"
            />
          </div>
        </div>

        {/* License Tiers Management */}
        <div className="pt-4 border-t border-vault-border">
          <div className="flex justify-between items-center mb-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-vault-muted">
              License Tiers & Pricing *
            </label>
            <button
              type="button"
              onClick={addTier}
              className="text-xs font-semibold text-vault-accent hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Tier
            </button>
          </div>

          <div className="space-y-3">
            {formData.licenseTiers.map((tier, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-neutral-50 border border-neutral-200 rounded">
                <input
                  type="text"
                  required
                  placeholder="Tier Name (e.g. Personal)"
                  value={tier.name}
                  onChange={(e) => handleTierChange(idx, "name", e.target.value)}
                  className="w-1/3 px-2.5 py-1.5 text-xs bg-white border border-vault-border rounded"
                />
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="Price (INR)"
                  value={tier.price}
                  onChange={(e) => handleTierChange(idx, "price", e.target.value)}
                  className="w-1/3 px-2.5 py-1.5 text-xs bg-white border border-vault-border rounded"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Limit (leave blank for unlimited)"
                  value={tier.remainingLicenses}
                  onChange={(e) => handleTierChange(idx, "remainingLicenses", e.target.value)}
                  className="w-1/3 px-2.5 py-1.5 text-xs bg-white border border-vault-border rounded"
                />
                {formData.licenseTiers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTier(idx)}
                    className="p-1.5 text-neutral-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="exampleBtn w-full py-3.5 text-sm"
        >
          <span>{submitting ? "Publishing Asset..." : "Publish 3D Asset Listing"}</span>
        </button>
      </form>
    </div>
  );
};

export default NewListing;
