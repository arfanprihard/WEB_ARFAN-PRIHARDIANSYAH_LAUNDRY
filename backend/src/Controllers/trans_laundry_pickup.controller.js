import trans_laundry_pickupModel from "../Models/trans_laundry_pickup.model.js";
import { sendError, sendSuccess } from "../Utils/response.helper.js";
import query from "../config/db.js";

const getAllPickups = async (req, res) => {
  try {
    const data = await trans_laundry_pickupModel.getAllPickups();
    return sendSuccess(res, "Pickups retrieved successfully.", data);
  } catch (error) {
    return sendError(res, "Failed to retrieve pickups", error);
  }
};

const getPickupById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await trans_laundry_pickupModel.getPickupById(id);
    if (data.length === 0) {
      return sendError(res, `Pickup with id: ${id} not found`, null, 404);
    }
    return sendSuccess(res, `Pickup with id: ${id} retrieved successfully.`, data[0]);
  } catch (error) {
    return sendError(res, "Failed to retrieve pickup", error);
  }
};

const createPickup = async (req, res) => {
  try {
    const body = req.body;
    const errors = {};

    if (body.id_order === undefined || body.id_order === null || String(body.id_order).trim() === "") {
      errors.id_order = "id_order is required.";
    }
    if (body.id_customer === undefined || body.id_customer === null || String(body.id_customer).trim() === "") {
      errors.id_customer = "id_customer is required.";
    }

    if (Object.keys(errors).length > 0) {
      return sendError(res, "Validation failed", errors, 400);
    }

    const result = await trans_laundry_pickupModel.createPickup(body);

    // If payment details are provided at pickup, update the order's payment info
    if (body.amount_paid !== undefined && body.amount_paid !== null) {
      await query(
        `UPDATE trans_order 
         SET total = ?, order_change = ?, payment_status = 'Lunas' 
         WHERE id = ?`,
        [body.amount_paid, body.order_change || 0, body.id_order]
      );
    }

    return sendSuccess(res, "Pickup created successfully.", result, 201);
  } catch (error) {
    return sendError(res, "Failed to create pickup", error);
  }
};

const updatePickupById = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const errors = {};

    if (body.id_order === undefined || body.id_order === null || String(body.id_order).trim() === "") {
      errors.id_order = "id_order is required.";
    }
    if (body.id_customer === undefined || body.id_customer === null || String(body.id_customer).trim() === "") {
      errors.id_customer = "id_customer is required.";
    }

    if (Object.keys(errors).length > 0) {
      return sendError(res, "Validation failed", errors, 400);
    }

    const result = await trans_laundry_pickupModel.updatePickupById(id, body);
    if (result.affectedRows === 0) {
      return sendError(res, `Pickup with id: ${id} not found`, null, 404);
    }
    return sendSuccess(res, `Pickup with id: ${id} updated successfully.`);
  } catch (error) {
    return sendError(res, "Failed to update pickup", error);
  }
};

const deletePickupById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await trans_laundry_pickupModel.deletePickupById(id);
    if (result.affectedRows === 0) {
      return sendError(res, `Pickup with id: ${id} not found`, null, 404);
    }
    return sendSuccess(res, `Pickup with id: ${id} deleted successfully.`);
  } catch (error) {
    return sendError(res, "Failed to delete pickup", error);
  }
};

export default {
  getAllPickups,
  getPickupById,
  createPickup,
  updatePickupById,
  deletePickupById,
};
