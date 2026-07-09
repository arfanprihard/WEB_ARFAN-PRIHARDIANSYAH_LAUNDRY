import trans_order_detailModel from "../Models/trans_order_detail.model.js";
import { sendError, sendSuccess } from "../Utils/response.helper.js";

const getAllOrderDetails = async (req, res) => {
  try {
    const { id_order } = req.query;
    const data = await trans_order_detailModel.getAllOrderDetails(id_order);
    return sendSuccess(res, "Order details retrieved successfully.", data);
  } catch (error) {
    return sendError(res, "Failed to retrieve order details", error);
  }
};

const getOrderDetailById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await trans_order_detailModel.getOrderDetailById(id);
    if (data.length === 0) {
      return sendError(res, `Order detail with id: ${id} not found`, null, 404);
    }
    return sendSuccess(res, `Order detail with id: ${id} retrieved successfully.`, data[0]);
  } catch (error) {
    return sendError(res, "Failed to retrieve order detail", error);
  }
};

const createOrderDetail = async (req, res) => {
  try {
    const body = req.body;
    const errors = {};

    if (body.id_order === undefined || body.id_order === null || String(body.id_order).trim() === "") {
      errors.id_order = "id_order is required.";
    }
    if (body.id_service === undefined || body.id_service === null || String(body.id_service).trim() === "") {
      errors.id_service = "id_service is required.";
    }
    if (body.qty === undefined || body.qty === null || String(body.qty).trim() === "") {
      errors.qty = "qty is required.";
    }
    if (body.amount === undefined || body.amount === null || String(body.amount).trim() === "") {
      errors.amount = "amount is required.";
    }

    if (Object.keys(errors).length > 0) {
      return sendError(res, "Validation failed", errors, 400);
    }

    const result = await trans_order_detailModel.createOrderDetail(body);
    return sendSuccess(res, "Order detail created successfully.", result, 201);
  } catch (error) {
    return sendError(res, "Failed to create order detail", error);
  }
};

const updateOrderDetailById = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const errors = {};

    if (body.id_order === undefined || body.id_order === null || String(body.id_order).trim() === "") {
      errors.id_order = "id_order is required.";
    }
    if (body.id_service === undefined || body.id_service === null || String(body.id_service).trim() === "") {
      errors.id_service = "id_service is required.";
    }
    if (body.qty === undefined || body.qty === null || String(body.qty).trim() === "") {
      errors.qty = "qty is required.";
    }
    if (body.amount === undefined || body.amount === null || String(body.amount).trim() === "") {
      errors.amount = "amount is required.";
    }

    if (Object.keys(errors).length > 0) {
      return sendError(res, "Validation failed", errors, 400);
    }

    const result = await trans_order_detailModel.updateOrderDetailById(id, body);
    if (result.affectedRows === 0) {
      return sendError(res, `Order detail with id: ${id} not found`, null, 404);
    }
    return sendSuccess(res, `Order detail with id: ${id} updated successfully.`);
  } catch (error) {
    return sendError(res, "Failed to update order detail", error);
  }
};

const deleteOrderDetailById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await trans_order_detailModel.deleteOrderDetailById(id);
    if (result.affectedRows === 0) {
      return sendError(res, `Order detail with id: ${id} not found`, null, 404);
    }
    return sendSuccess(res, `Order detail with id: ${id} deleted successfully.`);
  } catch (error) {
    return sendError(res, "Failed to delete order detail", error);
  }
};

export default {
  getAllOrderDetails,
  getOrderDetailById,
  createOrderDetail,
  updateOrderDetailById,
  deleteOrderDetailById,
};
