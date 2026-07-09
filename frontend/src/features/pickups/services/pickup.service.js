import api from "../../../config/api";

const getAllPickups = async () => {
  const response = await api.get("/trans-laundry-pickups");
  return response.data;
};

const createPickup = async (data) => {
  const response = await api.post("/trans-laundry-pickups", data);
  return response.data;
};

const deletePickupById = async (id) => {
  const response = await api.delete(`/trans-laundry-pickups/${id}`);
  return response.data;
};

export default {
  getAllPickups,
  createPickup,
  deletePickupById,
};
