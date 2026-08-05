import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { login as loginApi, getCurrentUser, logout as logoutApi } from "../services/auth";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user_profile");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(!localStorage.getItem("user_profile"));

  const savePermissions = (userData) => {
    if (userData?.role?.permissions) {
      const permissionsList = userData.role.permissions.map(perm => perm.name || perm);
      localStorage.setItem("user_permissions", JSON.stringify(permissionsList));
    }
  };

  const checkAuth = useCallback(async () => {
    try {
      const response = await getCurrentUser();
      const userData = response?.data?.user || response?.data;

      if (response?.success && userData) {
        setUser(userData);
        localStorage.setItem("user_profile", JSON.stringify(userData));
        savePermissions(userData);
      } else {
        throw new Error("SILENT_LOGOUT");
      }
    } catch (error) {
      if (error?.response?.status !== 401 && error?.message !== "SILENT_LOGOUT") {
        console.error("Auth check failed:", error);
        toast.error("Session expired or authentication failed. Please log in again.");
      }

      setUser(null);
      localStorage.removeItem("user_profile");
      localStorage.removeItem("user_permissions");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (payload) => {
    try {
      const response = await loginApi(payload);

      if (response?.success) {
        await checkAuth();
      }

      return response;
    } catch (error) {
      console.error("Login service error:", error);

      const errorMsg = error?.response?.data?.message || "Invalid credentials or server error. Please try again.";
      toast.error(errorMsg);

      throw error;
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user_profile");
    localStorage.removeItem("user_permissions");

    toast.info("You have been logged out securely.");

    if (logoutApi) {
      logoutApi().catch((error) => {
        console.error("Logout API failed", error);
      });
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout,
    checkAuth,
    isAuthenticated: !!user,
  }), [user, loading, checkAuth, logout]);

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="vh-100 d-flex align-items-center justify-content-center bg-light">
          <div className="text-center">
            <div className="spinner-border text-primary mb-2" role="status"></div>
            <p className="text-muted small fw-semibold">Verifying Secure Session...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used strictly within an AuthProvider hierarchy.");
  }
  return context;
}