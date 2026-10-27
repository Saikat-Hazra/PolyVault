import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import ModelPreview from "../components/ModelPreview";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Check, Shield, Layers, FileCode, Heart, ShoppingBag, ArrowLeft } from "lucide-react";

export const AssetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [asset, setAsset] = useState(null);
  const [selectedTier, setSelectedTier] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [addedMessage, setAddedMessage] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/assets/${id}`);
        setAsset(res.data);
        if (res.data?.licenseTiers?.length) {
          setSelectedTier(res.data.licenseTiers[0].name);
        }

        if (user) {
          const wishRes = await api.get("/wishlist");
          const hasIt = (wishRes.data || []).some((a) => a._id === id);
          setIsWishlisted(hasIt);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAsset();
  }, [id, user]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setAdding(true);
    setAddedMessage("");
    try {
      await addToCart(asset._id, selectedTier);
      setAddedMessage("Added to cart!");
      setTimeout(() => setAddedMessage(""), 3000);
    } catch (err) {
      alert(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) return navigate("/login");
    try {
      if (isWishlisted) {
        await api.delete(`/wishlist/${asset._id}`);
        setIsWishlisted(false);
      } else {
        await api.post(`/wishlist/${asset._id}`);
        setIsWishlisted(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-vault-dark border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="font-serif text-2xl font-bold">Asset Not Found</h2>
        <Link to="/" className="text-vault-accent hover:underline mt-4 inline-block text-sm">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const activeTierObj = asset.licenseTiers.find((t) => t.name === selectedTier);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-vault-muted dark:text-neutral-400 hover:text-vault-dark dark:hover:text-[#EDE8E1] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: 3D Viewport & Metadata */}
        <div className="lg:col-span-7 space-y-6">
          <ModelPreview
            modelUrl={asset.previewModelUrl}
            polycount={asset.polycount}
            title={asset.title}
          />

          <div className="bg-white dark:bg-[#16181D] border border-vault-border dark:border-neutral-800 rounded-lg p-6 transition-colors">
            <h3 className="font-serif text-lg font-bold text-vault-dark dark:text-[#EDE8E1] mb-3">Specification & Topology</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3 bg-neutral-50 dark:bg-[#111317] rounded border border-neutral-100 dark:border-neutral-800">
                <span className="text-vault-muted dark:text-neutral-500 block">CATEGORY</span>
                <span className="font-bold text-vault-dark dark:text-[#EDE8E1] uppercase">{asset.category}</span>
              </div>
              <div className="p-3 bg-neutral-50 dark:bg-[#111317] rounded border border-neutral-100 dark:border-neutral-800">
                <span className="text-vault-muted dark:text-neutral-500 block">GEOMETRY</span>
                <span className="font-bold text-vault-dark dark:text-[#EDE8E1]">
                  {asset.polycount ? `${asset.polycount.toLocaleString()} Polys` : "Procedural"}
                </span>
              </div>
              <div className="p-3 bg-neutral-50 dark:bg-[#111317] rounded border border-neutral-100 dark:border-neutral-800">
                <span className="text-vault-muted dark:text-neutral-500 block">DELIVERABLE</span>
                <span className="font-bold text-vault-dark dark:text-[#EDE8E1]">
                  {asset.fileFormats?.join(", ") || ".blend, .fbx"}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <h4 className="text-xs font-semibold text-vault-dark dark:text-[#EDE8E1] mb-2">Description</h4>
              <p className="text-sm text-vault-muted dark:text-neutral-400 leading-relaxed">
                {asset.description || "Production-ready digital 3D model designed for game engines and VFX."}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Licensing & Purchase Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-[#16181D] border border-vault-border dark:border-neutral-800 rounded-lg p-6 shadow-craft transition-colors">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-vault-accent font-semibold block">
                  {asset.category}
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-vault-dark dark:text-[#EDE8E1] mt-0.5">
                  {asset.title}
                </h1>
                <p className="text-xs text-vault-muted dark:text-neutral-400 mt-1">
                  Authored by <span className="font-medium text-vault-dark dark:text-neutral-200">{asset.creator?.fullName || "Vault Creator"}</span>
                </p>
              </div>

              <button
                onClick={handleToggleWishlist}
                className="p-2.5 rounded-full border border-vault-border dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : "text-vault-muted dark:text-neutral-400"}`} />
              </button>
            </div>

            {/* License Tier Selection */}
            <div className="mt-6">
              <label className="block text-xs font-semibold uppercase tracking-wider text-vault-muted dark:text-neutral-400 mb-2">
                Choose License Tier
              </label>

              <div className="space-y-3">
                {asset.licenseTiers.map((tier) => {
                  const isSelected = selectedTier === tier.name;
                  const isSoldOut = tier.remainingLicenses !== null && tier.remainingLicenses <= 0;

                  return (
                    <div
                      key={tier.name}
                      onClick={() => !isSoldOut && setSelectedTier(tier.name)}
                      className={`p-3.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "border-vault-accent bg-vault-accentLight/30 dark:bg-vault-accent/20 ring-1 ring-vault-accent"
                          : isSoldOut
                          ? "opacity-50 cursor-not-allowed bg-neutral-50 dark:bg-neutral-900 border-vault-border dark:border-neutral-800"
                          : "border-vault-border dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 bg-white dark:bg-[#111317]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? "border-vault-accent bg-vault-accent" : "border-neutral-300 dark:border-neutral-600"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-vault-dark dark:text-[#EDE8E1]">{tier.name}</span>
                            {tier.remainingLicenses !== null && (
                              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-vault-muted dark:text-neutral-400">
                                {isSoldOut ? "Sold Out" : `${tier.remainingLicenses} remaining`}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-vault-muted dark:text-neutral-400">
                            {tier.name === "Personal"
                              ? "Non-commercial individual projects"
                              : tier.name === "Commercial"
                              ? "Commercial games, films, advertising"
                              : "Extended redistributable / multi-seat rights"}
                          </span>
                        </div>
                      </div>

                      <span className="font-mono text-base font-bold text-vault-dark dark:text-[#EDE8E1]">
                        ₹{tier.price.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total & Action */}
            <div className="mt-8 pt-6 border-t border-vault-border dark:border-neutral-800">
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-xs font-semibold text-vault-muted dark:text-neutral-400 uppercase tracking-wider">
                  Selected Tier Price
                </span>
                <span className="font-mono text-3xl font-bold text-vault-dark dark:text-[#EDE8E1]">
                  ₹{activeTierObj?.price?.toLocaleString() || 0}
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={adding || (activeTierObj?.remainingLicenses !== null && activeTierObj?.remainingLicenses <= 0)}
                className="exampleBtn w-full py-3.5 text-sm"
              >
                <span>
                  <ShoppingBag className="w-4 h-4" />
                  {adding ? "Adding..." : `Add ${selectedTier} License to Cart`}
                </span>
              </button>

              {addedMessage && (
                <div className="mt-3 text-center text-xs font-semibold text-emerald-600 animate-in fade-in">
                  {addedMessage} — <Link to="/cart" className="underline">View Cart</Link>
                </div>
              )}

              <p className="text-[11px] text-vault-muted text-center mt-4">
                Encrypted payment verification via Razorpay. Secure deliverable unlock immediately upon order completion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetail;
