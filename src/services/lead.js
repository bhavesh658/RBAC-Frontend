import api from "./api";

export const getLeads = async (params = {}) => {
  const response = await api.get("/leads", { params });
  return response.data;
};

export const getLeadById = async (id) => {
  const response = await api.get(`/leads/${id}`);
  return response.data;
};

export const createLead = async (data) => {
  const response = await api.post("/leads", data);
  return response.data;
};

export const updateLead = async (id, data) => {
  const response = await api.patch(`/leads/${id}`, data);
  return response.data;
};

export const deleteLead = async (id) => {
  const response = await api.delete(`/leads/${id}`);
  return response.data;
};

export const assignLead = async (id, data) => {
  const response = await api.patch(`/leads/${id}/assign`, data);
  return response.data;
};

export const updateLeadStatus = async (id, data) => {
  const response = await api.patch(`/leads/${id}/status`, data);
  return response.data;
};

export const getMyLeads = async (params = {}) => {
  const response = await api.get("/leads/my-leads", { params });
  return response.data;
}