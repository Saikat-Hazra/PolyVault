import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Catalog from "./pages/Catalog";
import AssetDetail from "./pages/AssetDetail";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import MyListings from "./pages/MyListings";
import NewListing from "./pages/NewListing";
import SalesDashboard from "./pages/SalesDashboard";
import About from "./pages/About";

function AppContent() {
  const { isDark } = useTheme();

  // Direct inline styles that WILL work
  const bgColor = isDark ? "#000000" : "#FFFFFF";
  const textColor = isDark ? "#EDE8E1" : "#121417";

  return (
    <div
      style={{
        backgroundColor: bgColor,
        color: textColor,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        transition: "background-color 0.3s ease, color 0.3s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ========================================================================
          DARK MODE BACKGROUND — Dotted Grid Pattern
          ======================================================================== */}
      {isDark && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: -2,
            backgroundImage: "radial-gradient(#ffffff33 1px, #00091d 1px)",
            backgroundSize: "20px 20px",
            backgroundColor: "#000000",
            pointerEvents: "none",
          }}
        />
      )}

      {/* ========================================================================
          LIGHT MODE BACKGROUND — Grid Lines with Radial Gradient Mask
          ======================================================================== */}
      {!isDark && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: -1,
            backgroundImage: `
        linear-gradient(135deg, #fafaf9 0%, #f5f3f0 100%),
        linear-gradient(to right, #d1d5db1a 1px, transparent 1px),
        linear-gradient(to bottom, #d1d5db1a 1px, transparent 1px)
      `,
            backgroundSize: "100% 100%, 20px 20px, 20px 20px",
            backgroundColor: "#FFFFFF",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Main Content */}
      <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            {/* Public & Catalog */}
            <Route path="/" element={<Catalog />} />
            <Route path="/assets/:id" element={<AssetDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<Cart />} />

            {/* Buyer Protected */}
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-success/:id"
              element={
                <ProtectedRoute>
                  <OrderSuccess />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute>
                  <OrderDetails />
                </ProtectedRoute>
              }
            />

            {/* Creator Protected */}
            <Route
              path="/creator/listings"
              element={
                <ProtectedRoute creatorOnly>
                  <MyListings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/creator/new"
              element={
                <ProtectedRoute creatorOnly>
                  <NewListing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/creator/sales"
              element={
                <ProtectedRoute creatorOnly>
                  <SalesDashboard />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer
          style={{
            borderTop: `1px solid ${isDark ? "#404050" : "#e2e2e2"}`,
            backgroundColor: isDark ? "#0a0a0a" : "#FFFFFF",
            padding: "24px",
            marginTop: "48px",
            textAlign: "center",
            fontSize: "12px",
            color: isDark ? "#a0a0a0" : "#666",
            transition: "background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease",
          }}
        >
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>© 2026 PolyVault. 3D Digital Asset Licensing Architecture.</span>
            <span style={{ fontFamily: "monospace", fontSize: "11px" }}>Razorpay Test Mode • Three.js WebGL Engine</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;