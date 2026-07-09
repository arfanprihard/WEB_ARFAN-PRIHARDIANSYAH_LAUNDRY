import query from "../config/db.js";

const getLevelById = async (id) => {
  const result = await query(`SELECT * FROM level WHERE id = ? AND deleted_at IS NULL`, [id]);
  return result;
};

const getAllLevels = async () => {
  const result = await query(`SELECT * FROM level WHERE deleted_at IS NULL ORDER BY id DESC`);
  return result;
};

const createLevel = async (body) => {
  const result = await query(`INSERT INTO level (level_name) VALUES (?)`, [
    body.level_name,
  ]);
  return result;
};

const updateLevelById = async (id, body) => {
  const result = await query(`UPDATE level SET level_name = ? WHERE id = ?`, [
    body.level_name,
    id,
  ]);
  return result;
};

const deleteLevelById = async (id) => {
  const result = await query(`UPDATE level SET deleted_at = NOW() WHERE id = ?`, [id]);
  return result;
};

export default {
  getLevelById,
  getAllLevels,
  updateLevelById,
  deleteLevelById,
  createLevel,
};
