import api from "./api"; // Aapka axios instance

export const getDailyReport = async (date) => {
  // date format: YYYY-MM-DD
  const response = await api.get(`/reports/daily?date=${date}`);
  return response.data;
};

export const getMonthlyReport = async (month, year) => {
  const response = await api.get(`/reports/monthly?month=${month}&year=${year}`);
  return response.data;
};

export const getDepartmentReport = async (departmentId) => {
  const response = await api.get(`/reports/department/${departmentId}`);
  return response.data;
};


export const getUserComprehensiveReport = async (userId, startDate = "", endDate = "") => {
  let url = `/reports/user/${userId}`;
  if (startDate && endDate) {
    url += `?startDate=${startDate}&endDate=${endDate}`;
  }
  const response = await api.get(url);
  return response.data;
};