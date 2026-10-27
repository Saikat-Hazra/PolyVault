import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { Download, ShieldCheck, ArrowLeft, Box } from "lucide-react";

export const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
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

  const handleDownload = async (assetId, assetTitle) => {
    setDownloadingId(assetId);
    try {
      const res = await api.get(`/orders/${id}/download/${assetId}`);
      alert(`Download Authorized for "${assetTitle}"!\nTime-limited secure link:\n${res.data.downloadUrl}`);
    } catch (err) {
      alert(`Download error: ${err.message}`);
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <div className="w-8 h-8 border-2 border-vault-dark border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="font-serif text-2xl font-bold">Order Not Found</h2>
        <Link to="/orders" className="text-vault-accent hover:underline mt-4 inline-block text-sm">
          Return to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 bg-white dark:bg-[#16181D]">
      <Link
        to="/orders"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-vault-muted dark:text-neutral-400 hover:text-vault-dark dark:hover:text-neutral-200 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </Link>

      <div className="border-b border-vault-border dark:border-neutral-800 pb-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-vault-accent font-semibold block mb-1">
            Order Snapshot
          </span>
          <h1 className="font-serif text-3xl font-bold text-vault-dark">
            Order #{order._id.slice(-8).toUpperCase()}
          </h1>
          <span className="text-xs text-vault-muted font-mono">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-mono px-3 py-1 rounded font-bold ${
              order.paymentStatus === "PAID"
                ? "bg-emerald-100 text-emerald-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {order.paymentStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Items & Downloads */}
        <div className="md:col-span-8 space-y-4">
          <h3 className="font-serif text-lg font-bold text-vault-dark">Licensed Deliverables</h3>

          {order.items?.map((item) => (
            <div
              key={item.asset}
              className="p-5 bg-white dark:bg-[#16181D] border border-vault-border dark:border-neutral-800 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-subtle"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-neutral-100 dark:bg-neutral-800 rounded border border-vault-border flex items-center justify-center flex-shrink-0">
                  {item.thumbnailImage ? (
                    <img src={item.thumbnailImage} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <Box className="w-6 h-6 text-neutral-400 dark:text-neutral-600" />
                  )}
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-vault-dark dark:text-neutral-100">{item.title}</h4>
                  <span className="text-xs font-mono text-vault-accent dark:text-neutral-400">{item.licenseTier} License</span>
                  <span className="block font-mono text-xs text-vault-muted dark:text-neutral-400 mt-0.5">
                    Snapshot Price: ₹{item.price?.toLocaleString()}
                  </span>
                </div>
              </div>

              {order.paymentStatus === "PAID" ? (
                <button
                  onClick={() => handleDownload(item.asset, item.title)}
                  disabled={downloadingId === item.asset}
                  className="exampleBtn py-2.5 px-4 text-xs w-full sm:w-auto"
                >
                  <span>
                    <Download className="w-4 h-4" />
                    {downloadingId === item.asset ? "Authorizing..." : "Download Files"}
                  </span>
                </button>
              ) : (
                <span className="text-xs text-red-500 font-medium">Payment Required</span>
              )}
            </div>
          ))}

          <div className="p-4 bg-vault-paper border border-vault-border rounded-lg text-xs text-vault-muted flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Cryptographic Download Gate:</strong> Deliverable 3D asset archives are streamed through an
              authenticated server route with HMAC signature expiration. Unauthorized hotlinking is strictly prevented.
            </span>
          </div>
        </div>

        {/* Billing snapshot */}
        <div className="md:col-span-4 bg-white p-6 border border-vault-border rounded-lg h-fit space-y-4">
          <h4 className="font-serif text-base font-bold text-vault-dark pb-2 border-b border-neutral-100">
            Billing Snapshot
          </h4>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-vault-muted dark:text-neutral-400 block">Billed To</span>
              <span className="font-semibold text-vault-dark dark:text-neutral-100">{order.billingDetails?.fullName}</span>
            </div>
            <div>
              <span className="text-vault-muted dark:text-neutral-400 block">Email</span>
              <span className="font-mono text-vault-dark dark:text-neutral-100">{order.billingDetails?.email}</span>
            </div>
            <div>
              <span className="text-vault-muted dark:text-neutral-400 block">Phone</span>
              <span className="font-mono text-vault-dark dark:text-neutral-100">{order.billingDetails?.phone}</span>
            </div>
            {order.billingDetails?.gstNumber && (
              <div>
                <span className="text-vault-muted block">GSTIN</span>
                <span className="font-mono text-vault-dark">{order.billingDetails.gstNumber}</span>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-baseline font-mono">
            <span className="text-xs text-vault-muted dark:text-neutral-400">Total Paid</span>
            <span className="text-xl font-bold text-vault-dark dark:text-neutral-100">₹{order.totalAmount?.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
