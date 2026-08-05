import api from "./api";

export const getProjects = async (params = {}) => {
  const response = await api.get("/projects", { params });
  return response.data;
};

// 2. Get single project by ID
export const getProjectById = async (id) => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

// 3. Create new project
export const createProject = async (data) => {
  const response = await api.post("/projects", data);
  return response.data;
};

// 4. Update basic project details
export const updateProject = async (id, data) => {
  const response = await api.patch(`/projects/${id}`, data);
  return response.data;
};

// 5. Delete a project
export const deleteProject = async (id) => {
  const response = await api.delete(`/projects/${id}`);
  return response.data;
};

// 6. Assign team members
export const assignMembers = async (id, membersData) => {
  const response = await api.patch(`/projects/${id}/assign-members`, membersData);
  return response.data;
};

// 7. Remove a team member
export const removeMember = async (id, memberData) => {
  const response = await api.patch(`/projects/${id}/remove-member`, memberData);
  return response.data;
};

// 8. Change Project Manager
export const changeManager = async (id, managerData) => {
  const response = await api.patch(`/projects/${id}/change-manager`, managerData);
  return response.data;
};