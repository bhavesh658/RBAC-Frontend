import axios from 'axios';

const api = axios.create({
  
  baseURL: import.meta.env.VITE_API_BASE_URL, 
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