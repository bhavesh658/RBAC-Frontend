import api from "./api"; 

export const getPermissions = async (limit = 1000) => {
  const response = await api.get("/permissions"); 
  return response.data;
};