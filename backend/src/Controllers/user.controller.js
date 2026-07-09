import userModel from "../Models/user.model.js";
import bcrypt from "bcryptjs";
import { sendError, sendSuccess } from "../Utils/response.helper.js";

const getAllUsers = async (req, res) => {
  try {
    const data = await userModel.getAllUsers();
    return sendSuccess(res, "Users retrieved successfully.", data);
  } catch (error) {
    return sendError(res, "Failed to retrieve users", error);
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await userModel.getUserById(id);
    if (data.length === 0) {
      return sendError(res, `User with id: ${id} not found`, null, 404);
    }
    return sendSuccess(res, `User with id: ${id} retrieved successfully.`, data[0]);
  } catch (error) {
    return sendError(res, "Failed to retrieve user", error);
  }
};

const createUser = async (req, res) => {
  try {
    const body = req.body;
    const errors = {};

    if (body.id_level === undefined || body.id_level === null || String(body.id_level).trim() === "") {
      errors.id_level = "id_level is required.";
    }
    if (!body.name?.trim()) {
      errors.name = "name cannot be empty.";
    }
    if (!body.email?.trim()) {
      errors.email = "email cannot be empty.";
    }
    if (!body.password?.trim()) {
      errors.password = "password cannot be empty.";
    }

    if (Object.keys(errors).length > 0) {
      return sendError(res, "Validation failed", errors, 400);
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const result = await userModel.createUser({ ...body, password: hashedPassword });
    return sendSuccess(res, "User created successfully.", result, 201);
  } catch (error) {
    return sendError(res, "Failed to create user", error);
  }
};

const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const errors = {};

    if (body.id_level === undefined || body.id_level === null || String(body.id_level).trim() === "") {
      errors.id_level = "id_level is required.";
    }
    if (!body.name?.trim()) {
      errors.name = "name cannot be empty.";
    }
    if (!body.email?.trim()) {
      errors.email = "email cannot be empty.";
    }

    if (Object.keys(errors).length > 0) {
      return sendError(res, "Validation failed", errors, 400);
    }

    let updateData = { ...body };
    if (body.password !== undefined && body.password !== null && String(body.password).trim() !== "") {
      updateData.password = await bcrypt.hash(body.password, 10);
    }

    const result = await userModel.updateUserById(id, updateData);
    if (result.affectedRows === 0) {
      return sendError(res, `User with id: ${id} not found`, null, 404);
    }
    return sendSuccess(res, `User with id: ${id} updated successfully.`);
  } catch (error) {
    return sendError(res, "Failed to update user", error);
  }
};

const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userModel.deleteUserById(id);
    if (result.affectedRows === 0) {
      return sendError(res, `User with id: ${id} not found`, null, 404);
    }
    return sendSuccess(res, `User with id: ${id} deleted successfully.`);
  } catch (error) {
    return sendError(res, "Failed to delete user", error);
  }
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
};
