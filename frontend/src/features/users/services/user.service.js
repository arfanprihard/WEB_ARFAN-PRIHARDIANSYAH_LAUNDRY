import api from "../../../config/api";

const getAllUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

const createUser = async (data) => {
  const response = await api.post("/users", data);
  return response.data;
};

const updateUserById = async (id, data) => {
  const response = await api.patch(`/users/${id}`, data);
  return response.data;
};

const deleteUserById = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
};
