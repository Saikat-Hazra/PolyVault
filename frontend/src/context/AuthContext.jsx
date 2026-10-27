import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await api.get("/customers/me");
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials) => {
    const res = await api.post("/customers/login", credentials);
    setUser(res.data);
    return res;
  };

  const register = async (userData) => {
    const res = await api.post("/customers/register", userData);
    setUser(res.data);
    return res;
  };

  const logout = async () => {
    await api.post("/customers/logout");
    setUser(null);
  };

  const becomeCreator = async () => {
    const res = await api.patch("/customers/become-creator");
    setUser(res.data);
    return res;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, becomeCreator, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
