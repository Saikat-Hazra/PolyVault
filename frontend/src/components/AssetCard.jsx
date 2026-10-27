import { Link } from "react-router-dom";
import { Box, Heart, Layers } from "lucide-react";

export const AssetCard = ({ asset, isWishlisted = false, onToggleWishlist }) => {
  const minPrice = asset.licenseTiers?.length
    ? Math.min(...asset.licenseTiers.map((t) => t.price))
    : 0;

  return (
    <div className="group bg-white dark:bg-[#16181D] rounded-lg border border-vault-border dark:border-neutral-800 overflow-hidden hover:shadow-craft transition-all duration-300 flex flex-col justify-between">
      {/* Visual Thumbnail */}
      <div className="relative aspect-[4/3] bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
        {asset.thumbnailImage ? (
          <img
            src={asset.thumbnailImage}
            alt={asset.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-vault-muted dark:text-neutral-500 bg-neutral-50 dark:bg-neutral-900">
            <Box className="w-10 h-10 mb-2 stroke-1 text-neutral-400 dark:text-neutral-600" />
            <span className="text-xs uppercase tracking-wider font-mono">3D Asset</span>
          </div>
        )}

        {/* 3D Indicator Pill */}
        <div className="absolute top-3 left-3 bg-vault-dark/85 dark:bg-black/75 backdrop-blur-sm text-vault-paper text-[11px] font-mono px-2 py-0.5 rounded flex items-center gap-1 border border-transparent dark:border-white/10">
          <Box className="w-3 h-3 text-vault-accent" />
          <span>3D GLB</span>
        </div>

        {/* Wishlist Button */}
        {onToggleWishlist && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleWishlist(asset._id);
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm text-vault-dark dark:text-neutral-200 hover:text-red-500 dark:hover:text-red-400 transition-colors shadow-subtle border border-transparent dark:border-neutral-700"
            title="Wishlist"
          >
            <Heart
              className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
            />
          </button>
        )}
      </div>

      {/* Meta Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-vault-muted dark:text-neutral-400 font-mono mb-1.5">
            <span className="uppercase tracking-wide">{asset.category}</span>
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3" />
              {asset.polycount ? `${asset.polycount.toLocaleString()} polys` : "Procedural"}
            </span>
          </div>

          <Link to={`/assets/${asset._id}`}>
            <h3 className="font-serif text-lg font-bold text-vault-dark dark:text-[#EDE8E1] group-hover:text-vault-accent dark:group-hover:text-vault-accent transition-colors line-clamp-1">
              {asset.title}
            </h3>
          </Link>
          <p className="text-xs text-vault-muted dark:text-neutral-400 line-clamp-2 mt-1">
            {asset.description || "Production-ready 3D asset with complete materials and license tiers."}
          </p>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-vault-muted dark:text-neutral-500 block">
              From
            </span>
            <span className="font-mono text-base font-bold text-vault-dark dark:text-[#EDE8E1]">
              ₹{minPrice.toLocaleString()}
            </span>
          </div>

          <Link to={`/assets/${asset._id}`} className="exampleBtn py-2 px-3.5 text-xs">
            <span>Inspect 3D</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AssetCard;
