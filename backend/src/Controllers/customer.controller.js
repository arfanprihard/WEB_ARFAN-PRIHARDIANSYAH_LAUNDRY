import customerModel from "../Models/customer.model.js";
import { sendSuccess, sendError } from "../Utils/response.helper.js";

const getAllCustomers = async (req, res) => {
  try {
    const data = await customerModel.getAllCustomers();
    return sendSuccess(res, "Customers retrieved successfully.", data);
  } catch (error) {
    return sendError(res, "Failed retrieve customers", error);
  }
};

const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await customerModel.getCustomerById(id);
    if (!data || data.length === 0) {
      return sendError(res, "Customer not found", null, 404);
    }
    return sendSuccess(res, "Customer retrieved successfully.", data[0]);
  } catch (error) {
    return sendError(res, "Failed retrieve customer", error);
  }
};

const updateCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const errors = {};
    if (!body.customer_name?.trim()) {
      errors.customer_name = "customer_name cannot be empty.";
    }
    if (Object.keys(errors).length > 0) {
      return sendError(res, "Validation failed", errors, 400);
    }
    const result = await customerModel.updateCustomerById(id, body);
    if (result.affectedRows === 0) {
      return sendError(res, "Id of Customer not found", null, 404);
    }
    return sendSuccess(res, "Data of Customer updated successfully.");
  } catch (error) {
    return sendError(res, "Failed update customer", error);
  }
};

const createCustomer = async (req, res) => {
  try {
    const body = req.body;
    const errors = {};
    if (!body.customer_name?.trim()) {
      errors.customer_name = "customer_name cannot be empty.";
    }

    if (Object.keys(errors).length > 0) {
      return sendError(res, "Validation failed", errors, 400);
    }
    const result = await customerModel.createCustomer(body);
    return sendSuccess(res, "Customer created successfully.", result, 201);
  } catch (error) {
    return sendError(res, "Failed create customer", error);
  }
};

const deleteCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await customerModel.deleteCustomerById(id);
    if (result.affectedRows === 0) {
      return sendError(res, "Id of Customer not found", null, 404);
    }
    return sendSuccess(res, "Customer deleted successfully.");
  } catch (error) {
    return sendError(res, "Failed delete customer", error);
  }
};

export default {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomerById,
  deleteCustomerById,
};
