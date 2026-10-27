import { Link, useNavigate } from "react-router-dom";
import { Box, ShoppingBag, Heart, User, LogOut, PlusCircle, ShieldCheck, Sun, Moon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";

export const Navbar = () => {
  const { user, logout, becomeCreator } = useAuth();
  const { itemCount } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-vault-paper/90 dark:bg-[#16181D]/90 backdrop-blur-md border-b border-vault-border dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-md bg-vault-dark dark:bg-neutral-800 flex items-center justify-center text-vault-paper transition-transform group-hover:scale-105 border border-transparent dark:border-neutral-700">
            <Box className="w-5 h-5 text-vault-accent" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-vault-dark dark:text-[#EDE8E1]">
            Poly<span className="italic font-normal text-vault-accent">Vault</span>
          </span>
        </Link>

        {/* Center Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-vault-muted dark:text-neutral-400">
          <Link to="/" className="hover:text-vault-dark dark:hover:text-[#EDE8E1] transition-colors">Catalog</Link>
          <Link to="/about" className="hover:text-vault-dark dark:hover:text-[#EDE8E1] transition-colors">About</Link>
          {user && (
            <>
              <Link to="/wishlist" className="hover:text-vault-dark dark:hover:text-[#EDE8E1] transition-colors flex items-center gap-1.5">
                <Heart className="w-4 h-4" />
                Wishlist
              </Link>
              <Link to="/orders" className="hover:text-vault-dark dark:hover:text-[#EDE8E1] transition-colors flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                My Vault Orders
              </Link>
            </>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-vault-muted dark:text-neutral-300 transition-colors border border-transparent hover:border-vault-border dark:hover:border-neutral-700"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-vault-dark animate-in spin-in-180 duration-300" />
            )}
          </button>

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-vault-dark dark:text-neutral-200"
            title="Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-vault-accent text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-subtle animate-in fade-in">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              {user.isCreator ? (
                <Link
                  to="/creator/listings"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded border border-vault-border dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-vault-dark dark:text-neutral-200 transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-vault-accent" />
                  Creator Hub
                </Link>
              ) : (
                <button
                  onClick={becomeCreator}
                  className="hidden sm:inline-flex text-xs font-semibold text-vault-accent hover:underline"
                >
                  Become a Creator
                </button>
              )}

              <div className="flex items-center gap-2 pl-2 border-l border-vault-border dark:border-neutral-800">
                <span className="text-xs font-medium text-vault-muted dark:text-neutral-400 hidden lg:inline">
                  {user.fullName}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-vault-muted dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm font-semibold text-vault-dark dark:text-neutral-200 hover:text-vault-accent dark:hover:text-vault-accent px-3 py-1.5 transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="exampleBtn text-xs px-4 py-2"
              >
                <span>Join Vault</span>
              </Link>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};

export default Navbar;
