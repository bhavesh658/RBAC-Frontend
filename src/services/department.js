import api from "./api";

export const getDepartments = async (page = 1, limit = 10) => {
  const { data } = await api.get("/departments", { 
    params: { page, limit } 
  });
  return data;
};

// 2. Get a single department by ID
export const getDepartmentById = async (id) => {
  const { data } = await api.get(`/departments/${id}`);
  return data;
};

// 3. Create a new department
export const createDepartment = async (payload) => {
  const { data } = await api.post("/departments", payload);
  return data;
};

// 4. Update department details
export const updateDepartment = async (id, payload) => {
  const { data } = await api.patch(`/departments/${id}`, payload);
  return data;
};

// 5. Assign a Head to the department
export const assignDepartmentHead = async (id, headId) => {
  const { data } = await api.patch(`/departments/${id}/assign-head`, { head: headId });
  return data;
};