import { Trash2, Box, Shield } from "lucide-react";

export const CartItem = ({ item, onTierChange, onRemove }) => {
  const asset = item.asset;
  if (!asset) return null;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white dark:bg-[#16181D] rounded-lg border border-vault-border dark:border-neutral-800 gap-4 transition-colors">
      {/* Thumbnail & Title */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded bg-neutral-100 dark:bg-neutral-900 border border-vault-border dark:border-neutral-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
          {asset.thumbnailImage ? (
            <img src={asset.thumbnailImage} alt={asset.title} className="w-full h-full object-cover" />
          ) : (
            <Box className="w-6 h-6 text-neutral-400 dark:text-neutral-600" />
          )}
        </div>
        <div>
          <h4 className="font-serif text-base font-bold text-vault-dark dark:text-[#EDE8E1]">{asset.title}</h4>
          <span className="text-xs font-mono uppercase text-vault-muted dark:text-neutral-400">{asset.category}</span>
        </div>
      </div>

      {/* Tier Selector & Price */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-vault-accent" />
          {asset.licenseTiers?.length > 1 ? (
            <select
              value={item.licenseTier}
              onChange={(e) => onTierChange(asset._id, e.target.value)}
              className="text-xs font-medium bg-neutral-50 dark:bg-[#121417] border border-vault-border dark:border-neutral-700 text-vault-dark dark:text-neutral-100 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-vault-accent"
            >
              {asset.licenseTiers.map((t) => (
                <option key={t.name} value={t.name} disabled={t.remainingLicenses === 0}>
                  {t.name} Tier — ₹{t.price} {t.remainingLicenses !== null ? `(${t.remainingLicenses} left)` : ""}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-xs font-semibold px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 rounded text-vault-dark dark:text-neutral-200">
              {item.licenseTier} License
            </span>
          )}
        </div>

        <div className="text-right min-w-[80px]">
          <span className="font-mono text-base font-bold text-vault-dark dark:text-[#EDE8E1]">
            ₹{item.price?.toLocaleString()}
          </span>
          <span className="block text-[10px] text-vault-muted dark:text-neutral-400 font-mono">Qty: 1</span>
        </div>

        {/* Remove */}
        <button
          onClick={() => onRemove(asset._id)}
          className="p-2 rounded hover:bg-red-50 dark:hover:bg-red-950/30 text-neutral-400 hover:text-red-500 transition-colors"
          title="Remove from cart"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
