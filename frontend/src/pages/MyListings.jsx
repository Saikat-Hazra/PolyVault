import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { PlusCircle, Box, Edit2, EyeOff, Eye, DollarSign } from "lucide-react";

export const MyListings = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyAssets = async () => {
    try {
      setLoading(true);
      const res = await api.get("/creator/assets");
      setAssets(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyAssets();
  }, []);

  const togglePublish = async (assetId, currentStatus) => {
    try {
      await api.patch(`/assets/${assetId}`, { isPublished: !currentStatus });
      fetchMyAssets();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 bg-white dark:bg-[#16181D]">
      <div className="border-b border-vault-border pb-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-vault-accent font-semibold block mb-1">
            Creator Studio
          </span>
          <h1 className="font-serif text-3xl font-bold text-vault-dark flex items-center gap-2">
            <Box className="w-6 h-6 text-vault-accent" />
            My Asset Listings
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/creator/sales" className="exampleBtn exampleBtn-dark py-2.5 px-4 text-xs">
            <span>
              <DollarSign className="w-4 h-4" />
              Sales & Earnings
            </span>
          </Link>
          <Link to="/creator/new" className="exampleBtn py-2.5 px-4 text-xs">
            <span>
              <PlusCircle className="w-4 h-4" />
              Upload New 3D Asset
            </span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-2 border-vault-dark border-t-transparent rounded-full animate-spin" />
        </div>
      ) : assets.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#16181D] border border-vault-border dark:border-neutral-800 rounded-lg p-8">
          <Box className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-vault-dark">No Listings Published</h3>
          <p className="text-xs text-vault-muted mt-1 mb-6">
            Publish your first Blender model or material to begin selling licenses.
          </p>
          <Link to="/creator/new" className="exampleBtn py-2.5 px-4 text-xs">
            <span>Create First Listing</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {assets.map((asset) => (
            <div
              key={asset._id}
              className="p-5 bg-white dark:bg-[#16181D] border border-vault-border dark:border-neutral-800 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-neutral-100 rounded border border-vault-border overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {asset.thumbnailImage ? (
                    <img src={asset.thumbnailImage} alt={asset.title} className="w-full h-full object-cover" />
                  ) : (
                    <Box className="w-6 h-6 text-neutral-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-serif text-base font-bold text-vault-dark">{asset.title}</h3>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        asset.isPublished ? "bg-emerald-100 text-emerald-800" : "bg-neutral-200 text-neutral-700"
                      }`}
                    >
                      {asset.isPublished ? "PUBLISHED" : "UNLISTED"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-vault-muted font-mono">
                    <span>{asset.category}</span>
                    <span>•</span>
                    <span>{asset.licenseTiers?.map((t) => `${t.name}: ₹${t.price}`).join(" | ")}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  onClick={() => togglePublish(asset._id, asset.isPublished)}
                  className="px-3 py-1.5 text-xs font-semibold rounded border border-vault-border hover:bg-neutral-50 text-vault-dark flex items-center gap-1.5"
                >
                  {asset.isPublished ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      Unlist
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      Publish
                    </>
                  )}
                </button>
                <Link
                  to={`/assets/${asset._id}`}
                  className="px-3 py-1.5 text-xs font-semibold rounded border border-vault-border hover:bg-neutral-50 text-vault-accent"
                >
                  View Public Page
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;
