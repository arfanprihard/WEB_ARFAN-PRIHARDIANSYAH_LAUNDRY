import levelModel from "../Models/level.model.js";
import { sendSuccess, sendError } from "../Utils/response.helper.js";

const getAllLevels = async (req, res) => {
  try {
    const data = await levelModel.getAllLevels();
    return sendSuccess(res, "Level retrieved successfully.", data, 200);
  } catch (error) {
    return sendError(res, "Failed to retrieved Level", error);
  }
};

const getLevelById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await levelModel.getLevelById(id);
    if (!data || data.length === 0) {
      return sendError(res, `Level id: ${id} not found`, null, 404);
    }
    return sendSuccess(
      res,
      `Level id: ${id} retrieved successfully.`,
      data[0],
      200,
    );
  } catch (error) {
    return sendError(res, `Failed to retrieved level`, error);
  }
};

const createLevel = async (req, res) => {
  try {
    const body = req.body;
    if (body.level_name === "") {
      return sendError(res, `Level name cannot be empty`, null, 400);
    }
    const result = await levelModel.createLevel(body);
    return sendSuccess(res, `Level created successfully.`);
  } catch (error) {
    return sendError(res, `Failed to create level`);
  }
};

const updateLevelById = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    if (body.level_name === "") {
      return sendError(res, `Level name cannot be empty`, null, 400);
    }
    const data = await levelModel.updateLevelById(id, body);
    if (data.affectedRows === 0) {
      return sendError(res, `Id of Level not found`, null, 404);
    }
    return sendSuccess(res, `Data id: ${id} of Level updated successfully.`);
  } catch (error) {
    return sendError(res, `Failed update level`, error);
  }
};

const deleteLevelById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await levelModel.deleteLevelById(id);
    if (result.affectedRows === 0) {
      return sendError(res, `Id of Level not found`, null, 404);
    }
    return sendSuccess(res, `Data id: ${id} of Level Deleted successfully.`);
  } catch (error) {
    return sendError(res, `Failed to delete level`, error);
  }
};

export default {
  getAllLevels,
  getLevelById,
  updateLevelById,
  createLevel,
  deleteLevelById,
};
