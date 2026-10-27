import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { CheckCircle2, Download, ArrowRight, Shield } from "lucide-react";

export const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <div className="w-8 h-8 border-2 border-vault-dark border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center bg-white dark:bg-[#16181D]">
      <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200 dark:border-emerald-700">
        <CheckCircle2 className="w-9 h-9" />
      </div>

      <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-300 font-semibold">
        Payment Verified & Order Placed
      </span>
      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-vault-dark dark:text-neutral-100 mt-1">
        Your Digital Assets Are Unlocked
      </h1>
      <p className="text-xs text-vault-muted dark:text-neutral-400 mt-2 max-w-md mx-auto">
        Your Razorpay Test Mode transaction was cryptographically validated. License snapshot stored on order #{id?.slice(-8)}.
      </p>

      {order && (
        <div className="mt-8 bg-white dark:bg-[#16181D] border border-vault-border dark:border-neutral-800 rounded-lg p-6 text-left shadow-craft">
          <div className="flex justify-between items-center pb-4 border-b border-neutral-100 dark:border-neutral-800 text-xs">
            <span className="text-vault-muted font-mono dark:text-neutral-400">ORDER ID: {order._id}</span>
            <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 rounded font-bold font-mono text-[10px]">
              {order.paymentStatus}
            </span>
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800 py-3">
            {order.items?.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-sm font-bold text-vault-dark dark:text-neutral-100">{item.title}</h4>
                  <span className="text-xs font-mono text-vault-accent dark:text-neutral-400">{item.licenseTier} License</span>
                </div>
                <span className="font-mono text-sm font-bold text-vault-dark dark:text-neutral-100">₹{item.price?.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-baseline font-mono">
            <span className="text-xs text-vault-muted dark:text-neutral-400">Total Paid:</span>
            <span className="text-xl font-bold text-vault-dark dark:text-neutral-100">₹{order.totalAmount?.toLocaleString()}</span>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Link to={`/orders/${id}`} className="exampleBtn py-3 px-6 text-xs">
          <span>
            <Download className="w-4 h-4" />
            Access Deliverable Files
          </span>
        </Link>
        <Link to="/" className="exampleBtn exampleBtn-dark py-3 px-6 text-xs">
          <span>
            Explore More 3D Assets
            <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
