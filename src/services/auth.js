import api from "./api";

// 1. Login
export const login = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return data;
};

// 2. Get Profile
export const getCurrentUser = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};

// 3. Logout
export const logout = async () => {
  const { data } = await api.post("/auth/logout");
  return data;
};

// 4. Forgot Password
export const forgotPassword = async (email) => {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
};

// 5. Reset Password
export const resetPassword = async (token, newPassword) => {
  const { data } = await api.post(`/auth/reset-password`, { token, newPassword });
  return data;
};


export const changePassword = async (currentPassword, newPassword) => {
  const { data } = await api.post("/auth/change-password", { currentPassword, newPassword });
  return data;
};