import type_of_serviceModel from "../Models/type_of_service.model.js";
import { sendError, sendSuccess } from "../Utils/response.helper.js";

const getAllTypeOfServices = async (req, res) => {
  try {
    const data = await type_of_serviceModel.getAllTypeOfServices();
    return sendSuccess(res, "type Of Service retrieved successfully.", data);
  } catch (error) {
    return sendError(res, `Failed retrieve type Of Service`, error);
  }
};

const getTypeOfServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await type_of_serviceModel.getTypeOfServiceById(id);
    if (data.length === 0) {
      return sendError(res, `Type Of Service by id : ${id} not found`, null, 404);
    }
    return sendSuccess(
      res,
      `Type Of Service by id : ${id} retreived successfully.`,
      data[0],
    );
  } catch (error) {
    return sendError(res, `Failed retreive Type of Service`, error);
  }
};

const createTypeOfService = async (req, res) => {
  try {
    const body = req.body;
    const errors = {};
    if (!body.service_name?.trim()) {
      errors.service_name = "service_name cannot be empty.";
    }
    if (!body.price?.trim()) {
      errors.price = "price cannot be empty.";
    }

    if (Object.keys(errors).length > 0) {
      return sendError(res, "Validation failed", errors, 400);
    }
    const result = await type_of_serviceModel.createTypeOfService(body);
    return sendSuccess(res, `Type Of Service created successfully.`);
  } catch (error) {
    return sendError(res, `Failed create Type Of Service`, error);
  }
};

const updateTypeOfServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const errors = {};
    if (!body.service_name?.trim()) {
      errors.service_name = "service_name cannot be empty.";
    }

    if (!body.price?.trim()) {
      errors.price = "price cannot be empty.";
    }

    if (Object.keys(errors).length > 0) {
      return sendError(res, `Validation failed`, errors, 400);
    }

    const result = await type_of_serviceModel.updateTypeOfServiceById(id, body);
    if (result.affectedRows === 0) {
      return sendError(res, `Id of type_of_service not found`, null, 404);
    }
    return sendSuccess(
      res,
      `Type of Service with id = ${id} updated successfully.`,
    );
  } catch (error) {
    return sendError(res, `Failed to update Type of Service`, error);
  }
};

const deleteTypeOfServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await type_of_serviceModel.deleteTypeOfServiceById(id);
    if (result.affectedRows === 0) {
      return sendError(res, `Id of type_of_service not found`, null, 404);
    }
    return sendSuccess(
      res,
      `Type of Service with id = ${id} deleted successfully.`,
    );
  } catch (error) {
    return sendError(res, `Failed to delete Type of Service`, error);
  }
};

export default {
  getAllTypeOfServices,
  getTypeOfServiceById,
  createTypeOfService,
  updateTypeOfServiceById,
  deleteTypeOfServiceById,
};
