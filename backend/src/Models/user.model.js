import query from "../config/db.js";

const fields = ["id_level", "name", "email", "password"];

const getAllUsers = async () => {
  const result = await query(`
    SELECT u.id, u.id_level, u.name, u.email, u.created_at, u.updated_at, l.level_name 
    FROM user u
    LEFT JOIN level l ON u.id_level = l.id
    ORDER BY u.id DESC
  `);
  return result;
};

const getUserById = async (id) => {
  const result = await query(`
    SELECT u.id, u.id_level, u.name, u.email, u.created_at, u.updated_at, l.level_name 
    FROM user u
    LEFT JOIN level l ON u.id_level = l.id
    WHERE u.id = ?
  `, [id]);
  return result;
};

const createUser = async (body) => {
  const values = [
    body.id_level,
    body.name?.trim(),
    body.email?.trim(),
    body.password,
  ];

  const placeholders = fields.map(() => "?");
  const result = await query(
    `INSERT INTO user (${fields.join(", ")}) VALUES (${placeholders.join(", ")})`,
    values
  );
  return result;
};

const updateUserById = async (id, body) => {
  const updateFields = ["id_level = ?", "name = ?", "email = ?"];
  const values = [
    body.id_level,
    body.name?.trim(),
    body.email?.trim(),
  ];

  if (body.password !== undefined && body.password !== null && String(body.password).trim() !== "") {
    updateFields.push("password = ?");
    values.push(body.password);
  }

  values.push(id);

  const result = await query(
    `UPDATE user SET ${updateFields.join(", ")} WHERE id = ?`,
    values
  );
  return result;
};

const deleteUserById = async (id) => {
  const result = await query("DELETE FROM user WHERE id = ?", [id]);
  return result;
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
};
