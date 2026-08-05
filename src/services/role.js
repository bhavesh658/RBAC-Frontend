import api from "./api";

// 1. Get all roles (with pagination, search, etc.)
export const getRoles = async (params = {}) => {
  const response = await api.get("/roles", { params });
  return response.data;
};

// 2. Create a new role
export const createRole = async (data) => {
  const response = await api.post("/roles", data);
  return response.data;
};

// 3. Update an existing role (name, description, etc.)
export const updateRole = async (id, data) => {
  const response = await api.patch(`/roles/${id}`, data);
  return response.data;
};

// 4. Delete a role (Soft Delete)
export const deleteRole = async (id) => {
  const response = await api.delete(`/roles/${id}`);
  return response.data;
};

// 5. Toggle Role Status (Active/Inactive)
export const toggleRoleStatus = async (id, status) => {
  const response = await api.patch(`/roles/${id}/toggle-status`, { isActive: status });
  return response.data;
};

// 6. Get Roles by Department ID (For dropdowns in User creation)
export const getRolesByDepartment = async (deptId) => {
  const response = await api.get(`/roles/department/${deptId}`);
  return response.data;
};

// 7. Assign Permissions to a role
export const assignPermissions = async (id, permissions) => {
  const response = await api.patch(`/roles/${id}/permissions`, { permissions });
  return response.data;
};

//  8. NEW: Remove Permissions from a role (Matches backend route)
export const removePermissions = async (id, permissions) => {
  const response = await api.patch(`/roles/${id}/remove-permissions`, { permissions });
  return response.data;
};