import api from "./api";

// GET All Activity Logs
export const getActivityLogs = async (params = {}) => {
  const response = await api.get("/activity-logs", { params });
  return response.data;
};