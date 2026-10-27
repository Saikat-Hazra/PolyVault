import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";
import { ShoppingBag, ArrowRight, ShieldCheck, Box } from "lucide-react";

export const Cart = () => {
  const { cartItems, itemCount, subtotal, updateTier, removeFromCart, loading } = useCart();
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="border-b border-vault-border dark:border-neutral-800 pb-6 mb-8 flex items-center justify-between transition-colors">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-vault-accent font-semibold block mb-1">
            License Review
          </span>
          <h1 className="font-serif text-3xl font-bold text-vault-dark dark:text-[#EDE8E1] flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-vault-accent" />
            Digital License Cart
          </h1>
        </div>
        <span className="text-xs font-mono text-vault-muted dark:text-neutral-400">
          {itemCount} {itemCount === 1 ? "License" : "Licenses"} Selected
        </span>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-2 border-vault-dark dark:border-neutral-200 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : cartItems.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#16181D] border border-vault-border dark:border-neutral-800 rounded-lg p-8 transition-colors">
          <Box className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-vault-dark dark:text-[#EDE8E1]">Your License Cart is Empty</h3>
          <p className="text-xs text-vault-muted dark:text-neutral-400 mt-1 mb-6">
            You have not selected any 3D asset licenses yet.
          </p>
          <Link to="/" className="exampleBtn py-2.5 px-4 text-xs">
            <span>Explore 3D Assets</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Lines */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item) => (
              <CartItem
                key={item.asset?._id}
                item={item}
                onTierChange={updateTier}
                onRemove={removeFromCart}
              />
            ))}

            <div className="p-4 bg-neutral-100/70 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs text-vault-muted dark:text-neutral-400 flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Digital Licensing Guarantee:</strong> Each line represents a legally binding license tier
                agreement. Deliverables unlock instantly in .blend, .fbx, and source formats upon verified payment.
              </span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-[#16181D] border border-vault-border dark:border-neutral-800 rounded-lg p-6 shadow-craft sticky top-24 transition-colors">
              <h3 className="font-serif text-lg font-bold text-vault-dark dark:text-[#EDE8E1] pb-3 border-b border-neutral-100 dark:border-neutral-800">
                Order Summary
              </h3>

              <div className="space-y-3 py-4 text-xs border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex justify-between text-vault-muted dark:text-neutral-400">
                  <span>Selected Licenses ({itemCount})</span>
                  <span className="font-mono font-medium text-vault-dark dark:text-[#EDE8E1]">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-vault-muted dark:text-neutral-400">
                  <span>Digital Delivery</span>
                  <span className="font-mono text-emerald-600 font-semibold uppercase text-[10px]">Instant Unlock</span>
                </div>
                <div className="flex justify-between text-vault-muted dark:text-neutral-400">
                  <span>Taxes (GST)</span>
                  <span className="font-mono text-vault-muted dark:text-neutral-500">Calculated on checkout</span>
                </div>
              </div>

              <div className="py-4 flex items-baseline justify-between">
                <span className="text-sm font-bold text-vault-dark dark:text-[#EDE8E1]">Total Payable</span>
                <span className="font-mono text-2xl font-bold text-vault-dark dark:text-[#EDE8E1]">
                  ₹{subtotal.toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="exampleBtn w-full py-3.5 mt-2 text-sm"
              >
                <span>
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </span>
              </button>

              <p className="text-[10px] text-vault-muted text-center mt-3">
                Server-validated total. Razorpay Test Mode checkout opens next.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
