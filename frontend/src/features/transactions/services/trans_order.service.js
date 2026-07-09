import api from "../../../config/api";

const getAllOrders = async () => {
  const response = await api.get("/trans-orders");
  return response.data;
};

const getOrderById = async (id) => {
  const response = await api.get(`/trans-orders/${id}`);
  return response.data;
};

const createOrder = async (orderData, details) => {
  const orderResponse = await api.post("/trans-orders", orderData);
  
  if (orderResponse.data.success) {
    const orderId = orderResponse.data.data.insertId;
    
    for (const detail of details) {
      await api.post("/trans-order-details", {
        id_order: orderId,
        id_service: detail.id_service,
        qty: detail.qty,
        amount: detail.amount,
        notes: detail.notes || "",
      });
    }
    return orderResponse.data;
  }
  return orderResponse.data;
};

const deleteOrderById = async (id) => {
  const response = await api.delete(`/trans-orders/${id}`);
  return response.data;
};

const getAllOrderDetails = async () => {
  const response = await api.get("/trans-order-details");
  return response.data;
};

const getOrderDetailsByOrderId = async (orderId) => {
  const response = await api.get(`/trans-order-details?id_order=${orderId}`);
  return response.data;
};

export default {
  getAllOrders,
  getOrderById,
  createOrder,
  deleteOrderById,
  getAllOrderDetails,
  getOrderDetailsByOrderId,
};
