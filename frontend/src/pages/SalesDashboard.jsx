import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { DollarSign, ShoppingBag, ArrowLeft, TrendingUp } from "lucide-react";

export const SalesDashboard = () => {
  const [sales, setSales] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);
        const [salesRes, earningsRes] = await Promise.all([
          api.get("/creator/sales"),
          api.get("/creator/earnings"),
        ]);
        setSales(salesRes.data || []);
        setEarnings(earningsRes.data?.totalEarned || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSalesData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 bg-white dark:bg-[#16181D]">
      <Link
        to="/creator/listings"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-vault-muted hover:text-vault-dark mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Listings
      </Link>

      <div className="border-b border-vault-border pb-6 mb-8 flex justify-between items-center">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-vault-accent font-semibold block mb-1">
            Revenue Analytics
          </span>
          <h1 className="font-serif text-3xl font-bold text-vault-dark">Creator Sales Dashboard</h1>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-[#16181D] border border-vault-border dark:border-neutral-800 rounded-lg p-6 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-vault-muted">Total Gross Earnings</span>
            <div className="font-mono text-3xl font-bold text-vault-dark mt-1">₹{earnings.toLocaleString()}</div>
            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              Verified test mode payouts
            </span>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#16181D] border border-vault-border dark:border-neutral-800 rounded-lg p-6 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-vault-muted">Licenses Sold</span>
            <div className="font-mono text-3xl font-bold text-vault-dark mt-1">{sales.length}</div>
            <span className="text-[11px] text-vault-muted mt-1 block">Across all published assets</span>
          </div>
          <div className="w-12 h-12 bg-vault-accentLight text-vault-accent rounded-full flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Sales List Table */}
      <div className="bg-white dark:bg-[#16181D] border border-vault-border dark:border-neutral-800 rounded-lg overflow-hidden shadow-craft">
        <div className="p-4 border-b border-neutral-100">
          <h3 className="font-serif text-base font-bold text-vault-dark">Recent Verified Sales</h3>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center">
            <div className="w-8 h-8 border-2 border-vault-dark border-t-transparent rounded-full animate-spin" />
          </div>
        ) : sales.length === 0 ? (
          <div className="p-12 text-center text-xs text-vault-muted">
            No sales recorded yet. Once buyers license your models, each line will be recorded here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-vault-muted font-mono uppercase text-[10px] border-b border-neutral-100">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Asset</th>
                  <th className="py-3 px-4">License Tier</th>
                  <th className="py-3 px-4 text-right">Price (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {sales.map((sale, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50/50">
                    <td className="py-3 px-4 font-mono text-vault-muted">
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 font-semibold text-vault-dark">{sale.title}</td>
                    <td className="py-3 px-4 font-mono text-vault-accent">{sale.licenseTier}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-vault-dark">
                      ₹{sale.price.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesDashboard;
