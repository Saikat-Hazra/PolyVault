import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import AssetCard from "../components/AssetCard";
import { Heart, Box } from "lucide-react";

export const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await api.get("/wishlist");
      setWishlist(res.data || []);
    } catch {
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (assetId) => {
    try {
      await api.delete(`/wishlist/${assetId}`);
      setWishlist(wishlist.filter((a) => a._id !== assetId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="border-b border-vault-border dark:border-neutral-800 pb-6 mb-8 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-vault-accent dark:text-indigo-400 font-semibold block mb-1">
            Personal Collection
          </span>
          <h1 className="font-serif text-3xl font-bold text-vault-dark dark:text-neutral-100 flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            Saved 3D Assets
          </h1>
        </div>
        <span className="text-xs font-mono text-vault-muted dark:text-neutral-400">
          {wishlist.length} {wishlist.length === 1 ? "Item" : "Items"}
        </span>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-2 border-vault-dark dark:border-neutral-300 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : wishlist.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#16181D] border border-vault-border dark:border-neutral-800 rounded-lg p-8">
          <Box className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-vault-dark dark:text-neutral-100">Your Wishlist is Empty</h3>
          <p className="text-xs text-vault-muted dark:text-neutral-400 mt-1 mb-6">
            Explore the catalog and tap the heart icon to save 3D assets for later.
          </p>
          <Link to="/" className="exampleBtn py-2.5 px-4 text-xs">
            <span>Browse Catalog</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((asset) => (
            <AssetCard
              key={asset._id}
              asset={asset}
              isWishlisted={true}
              onToggleWishlist={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
