import trans_orderModel from "../Models/trans_order.model.js";
import { sendError, sendSuccess } from "../Utils/response.helper.js";

const getAllOrders = async (req, res) => {
  try {
    const data = await trans_orderModel.getAllOrders();
    return sendSuccess(res, "Orders retrieved successfully.", data);
  } catch (error) {
    return sendError(res, "Failed to retrieve orders", error);
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await trans_orderModel.getOrderById(id);
    if (data.length === 0) {
      return sendError(res, `Order with id: ${id} not found`, null, 404);
    }
    return sendSuccess(res, `Order with id: ${id} retrieved successfully.`, data[0]);
  } catch (error) {
    return sendError(res, "Failed to retrieve order", error);
  }
};

const createOrder = async (req, res) => {
  try {
    const body = req.body;
    const errors = {};

    if (body.id_customer === undefined || body.id_customer === null || String(body.id_customer).trim() === "") {
      errors.id_customer = "id_customer is required.";
    }
    if (body.order_qty === undefined || body.order_qty === null || String(body.order_qty).trim() === "") {
      errors.order_qty = "order_qty is required.";
    }
    if (body.order_total === undefined || body.order_total === null || String(body.order_total).trim() === "") {
      errors.order_total = "order_total is required.";
    }
    if (body.payment_status !== "Belum Lunas" && (body.total === undefined || body.total === null || String(body.total).trim() === "")) {
      errors.total = "total is required.";
    }

    if (Object.keys(errors).length > 0) {
      return sendError(res, "Validation failed", errors, 400);
    }

    const result = await trans_orderModel.createOrder(body);
    return sendSuccess(res, "Order created successfully.", {
      insertId: result.insertId,
      order_code: result.order_code,
    }, 201);
  } catch (error) {
    return sendError(res, "Failed to create order", error);
  }
};

const updateOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const errors = {};

    if (body.id_customer === undefined || body.id_customer === null || String(body.id_customer).trim() === "") {
      errors.id_customer = "id_customer is required.";
    }
    if (!body.order_code?.trim()) {
      errors.order_code = "order_code cannot be empty.";
    }
    if (body.order_qty === undefined || body.order_qty === null || String(body.order_qty).trim() === "") {
      errors.order_qty = "order_qty is required.";
    }
    if (body.order_total === undefined || body.order_total === null || String(body.order_total).trim() === "") {
      errors.order_total = "order_total is required.";
    }
    if (body.payment_status !== "Belum Lunas" && (body.total === undefined || body.total === null || String(body.total).trim() === "")) {
      errors.total = "total is required.";
    }

    if (Object.keys(errors).length > 0) {
      return sendError(res, "Validation failed", errors, 400);
    }

    const result = await trans_orderModel.updateOrderById(id, body);
    if (result.affectedRows === 0) {
      return sendError(res, `Order with id: ${id} not found`, null, 404);
    }
    return sendSuccess(res, `Order with id: ${id} updated successfully.`);
  } catch (error) {
    return sendError(res, "Failed to update order", error);
  }
};

const deleteOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await trans_orderModel.deleteOrderById(id);
    if (result.affectedRows === 0) {
      return sendError(res, `Order with id: ${id} not found`, null, 404);
    }
    return sendSuccess(res, `Order with id: ${id} deleted successfully.`);
  } catch (error) {
    return sendError(res, "Failed to delete order", error);
  }
};

export default {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderById,
  deleteOrderById,
};
