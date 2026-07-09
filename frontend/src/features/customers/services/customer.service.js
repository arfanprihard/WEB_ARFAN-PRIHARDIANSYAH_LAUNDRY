import api from "../../../config/api";

const getAllCustomers = async () => {
  const response = await api.get("/customers");
  return response.data;
};

const getCustomerById = async (id) => {
  const response = await api.get(`/customers/${id}`);
  return response.data;
};

const createCustomer = async (data) => {
  const response = await api.post("/customers", data);
  return response.data;
};

const updateCustomerById = async (id, data) => {
  const response = await api.patch(`/customers/${id}`, data);
  return response.data;
};

const deleteCustomerById = async (id) => {
  const response = await api.delete(`/customers/${id}`);
  return response.data;
};

export default {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomerById,
  deleteCustomerById,
};
