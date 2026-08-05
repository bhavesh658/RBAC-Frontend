import api from "./api";

export const getTasks = async (params = {}) => {
  const response = await api.get("/tasks", { params });
  return response.data;
};

export const createTask = async (data) => {
  const response = await api.post("/tasks", data);
  return response.data;
};

export const updateTask = async (id, data) => {
  const response = await api.patch(`/tasks/${id}`, data);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

export const assignTask = async (id, data) => {
  const response = await api.patch(`/tasks/${id}/assign`, data);
  return response.data;
};

export const changeTaskStatus = async (id, data) => {
  const response = await api.patch(`/tasks/${id}/status`, data);
  return response.data;
};

  export const myTasks = async(params = {})=>{
    const response = await api.get("tasks/my-tasks",{params});
    console.log(response);
    return response.data;
  }