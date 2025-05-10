// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // Uncomment if using JWT
  },
});

// Organizations
export const createOrganization = (data) => api.post("/api/user/create/organization", data);
export const getAllOrganizations = () => api.get("/api/user/organization");
export const getOrganizationById = (id) => api.get(`/api/user/get/organization/${id}`);

// Admins
export const createAdmin = (data) => api.post("/create/admin", data);

export default api;
