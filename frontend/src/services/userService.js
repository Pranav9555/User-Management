import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

export const getUsers = async () => (await api.get("/users")).data;
export const getStats = async () => (await api.get("/users/stats")).data;
export const getUserById = async (id) => (await api.get(`/users/${id}`)).data;
export const createUser = async (data) => (await api.post("/users", data)).data;
export const updateUser = async (id, data) =>
  (await api.put(`/users/${id}`, data)).data;
export const deleteUser = async (id) => (await api.delete(`/users/${id}`)).data;

export function getApiError(error) {
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    "Something went wrong. Please check the API and try again."
  );
}
