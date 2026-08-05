import api from "./api";

// Fetch Users
export const getUsers = async (page = 1, limit = 30) => {
  try {
    const response = await api.get('/users', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
  
// Create User
export const createUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error("Error in createUser service:", error);
    throw error;
  }
};

// Fetch User by ID
export const getUserById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);

    return response.data;
  } catch (error) {
    console.error("Error in getUserById service:", error);
    throw error;
  }
};

// Update User
export const updateUser = async (id, userData) => {
  try {
    const response = await api.patch(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete/Toggle Status User
export const toggleUserStatus = async (id) => {
  try {
    const response = await api.patch(`/users/${id}/toggle-status`);
    return response.data;
  } catch (error) {
    throw error;
  }
};