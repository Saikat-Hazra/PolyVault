import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { ShieldCheck, ArrowRight, Box } from "lucide-react";

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get("/orders");
        setOrders(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="border-b border-vault-border dark:border-neutral-800 pb-6 mb-8 flex items-center justify-between transition-colors">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-vault-accent font-semibold block mb-1">
            Buyer History
          </span>
          <h1 className="font-serif text-3xl font-bold text-vault-dark dark:text-[#EDE8E1] flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-vault-accent" />
            My Vault Orders
          </h1>
        </div>
        <span className="text-xs font-mono text-vault-muted dark:text-neutral-400">
          {orders.length} {orders.length === 1 ? "Record" : "Records"}
        </span>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-2 border-vault-dark dark:border-neutral-200 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#16181D] border border-vault-border dark:border-neutral-800 rounded-lg p-8 transition-colors">
          <Box className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-vault-dark dark:text-[#EDE8E1]">No Orders Placed Yet</h3>
          <p className="text-xs text-vault-muted dark:text-neutral-400 mt-1 mb-6">
            When you purchase licenses for 3D models or materials, your receipts will appear here.
          </p>
          <Link to="/" className="exampleBtn py-2.5 px-4 text-xs">
            <span>Explore 3D Assets</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white dark:bg-[#16181D] border border-vault-border dark:border-neutral-800 rounded-lg p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-craft transition-all"
            >
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono text-xs font-bold text-vault-dark dark:text-[#EDE8E1]">
                    #{order._id.slice(-8).toUpperCase()}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      order.paymentStatus === "PAID"
                        ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                        : "bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                  <span className="text-[11px] text-vault-muted dark:text-neutral-400 font-mono">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-vault-muted dark:text-neutral-400">
                  {order.items?.map((i) => `${i.title} (${i.licenseTier})`).join(", ")}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                <span className="font-mono text-base font-bold text-vault-dark">
                  ₹{order.totalAmount?.toLocaleString()}
                </span>
                <Link
                  to={`/orders/${order._id}`}
                  className="exampleBtn py-2 px-3 text-xs"
                >
                  <span>
                    View Details
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
