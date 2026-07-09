import query from "../config/db.js";

const fields = ["service_name", "price", "description"];

const getAllTypeOfServices = async () => {
  const result = await query(`SELECT * FROM type_of_service WHERE deleted_at IS NULL`);
  return result;
};

const getTypeOfServiceById = async (id) => {
  const result = await query(`SELECT * FROM type_of_service WHERE id = ? AND deleted_at IS NULL`, [
    id,
  ]);
  return result;
};

const createTypeOfService = async (body) => {
  const values = [
    body.service_name?.trim(),
    body.price?.trim(),
    body.description?.trim() || null,
  ];
  const result = await query(
    `INSERT INTO type_of_service (${fields.join(", ")}) VALUES (? , ? , ?)`,
    values,
  );
  return result;
};

const updateTypeOfServiceById = async (id, body) => {
  const fieldsUpdate = fields.map((field) => `${field} = ?`);
  const values = [
    body.service_name?.trim(),
    body.price?.trim(),
    body.description?.trim() || null,
    id,
  ];
  const result = await query(
    `UPDATE type_of_service SET ${fieldsUpdate.join(", ")} WHERE id = ?`,
    values,
  );
  return result;
};

const deleteTypeOfServiceById = async (id) => {
  const result = await query(`UPDATE type_of_service SET deleted_at = NOW() WHERE id = ?`, [id]);
  return result;
};

export default {
  getAllTypeOfServices,
  getTypeOfServiceById,
  createTypeOfService,
  updateTypeOfServiceById,
  deleteTypeOfServiceById,
};
