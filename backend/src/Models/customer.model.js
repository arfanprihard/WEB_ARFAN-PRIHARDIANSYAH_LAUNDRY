import query from "../config/db.js";

const fields = ["customer_name", "phone", "address"];

const getAllCustomers = async () => {
  const result = await query("SELECT * FROM customer WHERE deleted_at IS NULL ORDER by id DESC LIMIT 5");
  return result;
};

const getCustomerById = async (id) => {
  const result = await query("SELECT * FROM customer WHERE id = ? AND deleted_at IS NULL", [id]);
  return result;
};

const updateCustomerById = async (id, body) => {
  const fieldsUpdate = fields.map((field) => `${field} = ?`);
  const values = [
    body.customer_name?.trim(),
    body.phone?.trim() || null,
    body.address?.trim() || null,
    id,
  ];
  const result = await query(
    `UPDATE customer SET ${fieldsUpdate.join(", ")} WHERE id = ?`,
    values,
  );
  return result;
};

const createCustomer = async (body) => {
  const fieldsCreate = fields;
  const values = [
    body.customer_name?.trim(),
    body.phone?.trim() || null,
    body.address?.trim() || null,
  ];
  const placeholders = fieldsCreate.map(() => "?");
  const result = await query(
    `INSERT INTO customer (${fieldsCreate.join(", ")}) VALUES (${placeholders.join(", ")})`,
    values,
  );
  return result;
};

const deleteCustomerById = async (id) => {
  const result = await query("UPDATE customer SET deleted_at = NOW() WHERE id = ?", [id]);
  return result;
};

export default {
  getAllCustomers,
  updateCustomerById,
  createCustomer,
  deleteCustomerById,
  getCustomerById,
};
