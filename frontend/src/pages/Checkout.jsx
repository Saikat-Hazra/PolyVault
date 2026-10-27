import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { ShieldCheck, CreditCard, Lock, ArrowLeft } from "lucide-react";

export const Checkout = () => {
  const { cartItems, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [billingDetails, setBillingDetails] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    gstNumber: "",
  });

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  if (!cartItems.length) {
    return <Navigate to="/cart" replace />;
  }

  const handlePayment = async (e) => {
    e.preventDefault();
    setError("");

    // Client validation
    if (!billingDetails.fullName.trim()) return setError("Full name is required");
    if (!billingDetails.email.trim()) return setError("Valid email address is required");
    if (!/^\d{10}$/.test(billingDetails.phone.trim())) return setError("Phone must be exactly 10 digits");

    setProcessing(true);

    try {
      // 1. Create Order on Server (server-calculated total)
      const res = await api.post("/orders/create-payment-order", { billingDetails });
      const { orderId, razorpayOrderId, amount } = res.data;

      // 2. Open Razorpay Checkout modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount,
        currency: "INR",
        name: "PolyVault 3D",
        description: "3D Digital Asset License Purchase",
        order_id: razorpayOrderId,
        prefill: {
          name: billingDetails.fullName,
          email: billingDetails.email,
          contact: billingDetails.phone,
        },
        theme: {
          color: "#4f46e5",
        },
        handler: async function (response) {
          try {
            // 3. Cryptographic Verification on Server
            const verifyRes = await api.post("/orders/verify-payment", {
              shopKartOrderId: orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            clearCart();
            navigate(`/order-success/${verifyRes.orderId || orderId}`);
          } catch (verifyErr) {
            setError(verifyErr.message || "Payment verification failed. Please contact support.");
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
          },
        },
      };

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK failed to load. Please ensure your browser allows checkout scripts.");
      }

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (resp) {
        setError(`Payment rejected: ${resp.error.description}`);
        setProcessing(false);
      });
      rzp.open();
    } catch (err) {
      setError(err.message);
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <button
        onClick={() => navigate("/cart")}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-vault-muted dark:text-neutral-400 hover:text-vault-dark dark:hover:text-neutral-200 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Cart
      </button>

      <div className="border-b border-vault-border dark:border-neutral-800 pb-6 mb-8">
        <span className="text-xs font-mono uppercase tracking-widest text-vault-accent dark:text-indigo-400 font-semibold block mb-1">
          Final Settlement
        </span>
        <h1 className="font-serif text-3xl font-bold text-vault-dark dark:text-neutral-100 flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-vault-accent dark:text-indigo-400" />
          Checkout & Billing
        </h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded text-xs font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Form */}
        <div className="md:col-span-7 bg-white dark:bg-[#16181D] p-6 rounded-lg border border-vault-border dark:border-neutral-800 shadow-craft">
          <h3 className="font-serif text-lg font-bold text-vault-dark dark:text-neutral-100 mb-4">Billing Information</h3>

          <form onSubmit={handlePayment} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-vault-muted dark:text-neutral-400 mb-1">
                Full Name / Legal Entity
              </label>
              <input
                type="text"
                required
                value={billingDetails.fullName}
                onChange={(e) => setBillingDetails({ ...billingDetails, fullName: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800/80 border border-vault-border dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 rounded focus:outline-none focus:ring-1 focus:ring-vault-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-vault-muted dark:text-neutral-400 mb-1">
                Receipt Email
              </label>
              <input
                type="email"
                required
                value={billingDetails.email}
                onChange={(e) => setBillingDetails({ ...billingDetails, email: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800/80 border border-vault-border dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 rounded focus:outline-none focus:ring-1 focus:ring-vault-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-vault-muted dark:text-neutral-400 mb-1">
                Mobile Number (10 digits)
              </label>
              <input
                type="tel"
                required
                pattern="[0-9]{10}"
                value={billingDetails.phone}
                onChange={(e) => setBillingDetails({ ...billingDetails, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800/80 border border-vault-border dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 rounded focus:outline-none focus:ring-1 focus:ring-vault-accent"
                placeholder="9876543210"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-vault-muted dark:text-neutral-400 mb-1">
                GST / VAT Number (Optional)
              </label>
              <input
                type="text"
                maxLength={15}
                value={billingDetails.gstNumber}
                onChange={(e) => setBillingDetails({ ...billingDetails, gstNumber: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800/80 border border-vault-border dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 rounded focus:outline-none focus:ring-1 focus:ring-vault-accent"
                placeholder="15-character GSTIN for tax invoice"
              />
            </div>

            <button
              type="submit"
              disabled={processing}
              className="exampleBtn w-full py-3.5 mt-4 text-sm"
            >
              <span>
                <Lock className="w-4 h-4" />
                {processing ? "Authorizing Razorpay..." : `Pay ₹${subtotal.toLocaleString()} in Test Mode`}
              </span>
            </button>
          </form>
        </div>

        {/* Sidebar Summary */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white dark:bg-[#16181D] p-6 rounded-lg border border-vault-border dark:border-neutral-800">
            <h4 className="font-serif text-base font-bold text-vault-dark dark:text-neutral-100 mb-3">Order Items</h4>
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
              {cartItems.map((item) => (
                <div key={item.asset?._id} className="py-2.5 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-vault-dark dark:text-neutral-100 block">{item.asset?.title}</span>
                    <span className="text-vault-muted dark:text-neutral-400 font-mono">{item.licenseTier} License</span>
                  </div>
                  <span className="font-mono font-bold text-vault-dark dark:text-neutral-100">₹{item.price?.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 mt-4 border-t border-vault-border dark:border-neutral-800 flex justify-between items-baseline">
              <span className="text-sm font-bold text-vault-dark dark:text-neutral-100">Total</span>
              <span className="font-mono text-2xl font-bold text-vault-dark dark:text-neutral-100">
                ₹{subtotal.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="p-4 bg-vault-paper dark:bg-neutral-900/60 border border-vault-border dark:border-neutral-800 rounded-lg text-[11px] text-vault-muted dark:text-neutral-400 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-vault-dark dark:text-neutral-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Cryptographic HMAC Verification
            </div>
            <p>
              Your payment will be validated against Razorpay's cryptographic test signature on our Express API.
              Zero secret keys or deliverable archive paths are exposed to the client.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
