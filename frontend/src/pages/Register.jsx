import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Box } from "lucide-react";

export const Register = () => {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(formData);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-[#16181D] border border-vault-border dark:border-neutral-800 rounded-lg p-8 shadow-craft transition-colors">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-vault-dark dark:bg-neutral-800 rounded-md flex items-center justify-center mx-auto mb-3 text-vault-accent border border-transparent dark:border-neutral-700">
            <Box className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-vault-dark dark:text-[#EDE8E1]">Create Your Vault Account</h1>
          <p className="text-xs text-vault-muted dark:text-neutral-400 mt-1">Join the community of 3D artists, creators and developers</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-vault-muted dark:text-neutral-400 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-[#111317] border border-vault-border dark:border-neutral-700 text-vault-dark dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 rounded focus:bg-white dark:focus:bg-[#111317] focus:outline-none focus:ring-1 focus:ring-vault-accent"
              placeholder="e.g. Maya Lin"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-vault-muted dark:text-neutral-400 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-[#111317] border border-vault-border dark:border-neutral-700 text-vault-dark dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 rounded focus:bg-white dark:focus:bg-[#111317] focus:outline-none focus:ring-1 focus:ring-vault-accent"
              placeholder="artist@polyvault.io"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-vault-muted dark:text-neutral-400 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-[#111317] border border-vault-border dark:border-neutral-700 text-vault-dark dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 rounded focus:bg-white dark:focus:bg-[#111317] focus:outline-none focus:ring-1 focus:ring-vault-accent"
              placeholder="10-digit mobile number"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-vault-muted dark:text-neutral-400 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-[#111317] border border-vault-border dark:border-neutral-700 text-vault-dark dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 rounded focus:bg-white dark:focus:bg-[#111317] focus:outline-none focus:ring-1 focus:ring-vault-accent"
              placeholder="Minimum 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="exampleBtn w-full mt-2 py-3"
          >
            <span>{submitting ? "Creating Account..." : "Create Account"}</span>
          </button>
        </form>

        <p className="text-center text-xs text-vault-muted dark:text-neutral-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-vault-accent hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
