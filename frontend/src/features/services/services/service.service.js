import api from "../../../config/api";

const getAllServices = async () => {
  const response = await api.get("/type-of-service");
  return response.data;
};

const getServiceById = async (id) => {
  const response = await api.get(`/type-of-service/${id}`);
  return response.data;
};

const createService = async (data) => {
  const response = await api.post("/type-of-service", data);
  return response.data;
};

const updateServiceById = async (id, data) => {
  const response = await api.patch(`/type-of-service/${id}`, data);
  return response.data;
};

const deleteServiceById = async (id) => {
  const response = await api.delete(`/type-of-service/${id}`);
  return response.data;
};

export default {
  getAllServices,
  getServiceById,
  createService,
  updateServiceById,
  deleteServiceById,
};
