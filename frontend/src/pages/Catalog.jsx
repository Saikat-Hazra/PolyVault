import { useState, useEffect } from "react";
import api from "../services/api";
import AssetCard from "../components/AssetCard";
import { Search, Filter, Box } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Catalog = () => {
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [format, setFormat] = useState("");
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState([]);
  const { user } = useAuth();

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (search) params.search = search;
      if (format) params.format = format;

      const res = await api.get("/assets", { params });
      setAssets(res.data || []);
    } catch {
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMeta = async () => {
    try {
      const catRes = await api.get("/assets/categories");
      setCategories(catRes.data || []);

      if (user) {
        const wishRes = await api.get("/wishlist");
        setWishlistIds((wishRes.data || []).map((a) => a._id));
      }
    } catch {
      // Ignored for unauthenticated users
    }
  };

  useEffect(() => {
    fetchMeta();
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAssets();
    }, 200);
    return () => clearTimeout(timer);
  }, [selectedCategory, search, format]);

  const handleToggleWishlist = async (assetId) => {
    if (!user) return;
    try {
      if (wishlistIds.includes(assetId)) {
        await api.delete(`/wishlist/${assetId}`);
        setWishlistIds(wishlistIds.filter((id) => id !== assetId));
      } else {
        await api.post(`/wishlist/${assetId}`);
        setWishlistIds([...wishlistIds, assetId]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Editorial Hero Header */}
      <div className="border-b border-vault-border dark:border-neutral-800 pb-8 mb-8 transition-colors">
        <span className="text-xs font-mono uppercase tracking-widest text-vault-accent font-semibold block mb-2">
          Curated Digital Repository
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-vault-dark dark:text-[#EDE8E1] max-w-3xl">
          Production 3D Assets. <br />
          <span className="italic font-normal text-neutral-500 dark:text-neutral-400">Previewed in real-time. Transparently licensed.</span>
        </h1>
        <p className="mt-3 text-sm text-vault-muted dark:text-neutral-400 max-w-2xl leading-relaxed">
          PolyVault connects Blender modelers and technical artists with game developers and studios.
          Rotate topologies in live 3D before licensing, backed by server-verified digital deliveries.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 bg-white dark:bg-[#16181D] p-3 rounded-lg border border-vault-border dark:border-neutral-800 transition-colors">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-vault-muted dark:text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search characters, mechs, props..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 dark:bg-[#121417] border border-vault-border dark:border-neutral-700 text-vault-dark dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 rounded focus:outline-none focus:bg-white dark:focus:bg-[#121417] focus:ring-1 focus:ring-vault-accent"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedCategory("")}
            className={`px-3 py-1.5 text-xs font-semibold rounded whitespace-nowrap transition-colors ${
              selectedCategory === ""
                ? "bg-vault-dark dark:bg-neutral-100 text-vault-paper dark:text-vault-dark"
                : "bg-neutral-100 dark:bg-neutral-800 text-vault-muted dark:text-neutral-300 hover:text-vault-dark dark:hover:text-white"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-vault-dark dark:bg-neutral-100 text-vault-paper dark:text-vault-dark"
                  : "bg-neutral-100 dark:bg-neutral-800 text-vault-muted dark:text-neutral-300 hover:text-vault-dark dark:hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Format Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <Filter className="w-4 h-4 text-vault-muted dark:text-neutral-400 hidden sm:inline" />
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="text-xs font-medium bg-neutral-50 dark:bg-[#121417] border border-vault-border dark:border-neutral-700 text-vault-dark dark:text-neutral-100 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-vault-accent"
          >
            <option value="">All Formats</option>
            <option value=".blend">.blend (Blender)</option>
            <option value=".fbx">.fbx (Autodesk)</option>
            <option value=".obj">.obj (Wavefront)</option>
          </select>
        </div>
      </div>

      {/* Grid State */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-vault-dark dark:border-neutral-200 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-vault-muted dark:text-neutral-400">LOADING ASSET VAULT...</span>
        </div>
      ) : assets.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-[#16181D] border border-vault-border dark:border-neutral-800 rounded-lg p-8">
          <Box className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-vault-dark dark:text-[#EDE8E1]">No 3D Assets Found</h3>
          <p className="text-xs text-vault-muted dark:text-neutral-400 mt-1">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <AssetCard
              key={asset._id}
              asset={asset}
              isWishlisted={wishlistIds.includes(asset._id)}
              onToggleWishlist={user ? handleToggleWishlist : null}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Catalog;
