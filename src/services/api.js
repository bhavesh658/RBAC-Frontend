import axios from 'axios';

// Axios ka instance banayein
const api = axios.create({
  
  baseURL: 'https://rbac-system-444w.onrender.com/api/v1', 
  
  withCredentials: true, 
  
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized request - Maybe cookie expired or not sent");
    }
    return Promise.reject(error);
  }
);

export default api;