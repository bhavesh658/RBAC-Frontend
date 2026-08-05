import api from "./api"; // Ensure ye path aapke axios instance ko point kar raha ho

// Punch In API Call
export const punchIn = async () => {
  const response = await api.post("/attendance/punch-in"); 
  return response.data;
};

// Punch Out API Call
export const punchOut = async () => {
  const response = await api.post("/attendance/punch-out");
  return response.data;
};