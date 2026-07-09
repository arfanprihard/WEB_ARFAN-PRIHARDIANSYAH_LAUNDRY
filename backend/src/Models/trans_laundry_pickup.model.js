import query from "../config/db.js";

const fields = ["id_order", "id_customer", "pickup_date", "notes"];

const getAllPickups = async () => {
  const result = await query(`
    SELECT p.*, c.customer_name, o.order_code 
    FROM trans_laundry_pickup p
    LEFT JOIN customer c ON p.id_customer = c.id
    LEFT JOIN trans_order o ON p.id_order = o.id
    ORDER BY p.id DESC
  `);
  return result;
};

const getPickupById = async (id) => {
  const result = await query(`
    SELECT p.*, c.customer_name, o.order_code 
    FROM trans_laundry_pickup p
    LEFT JOIN customer c ON p.id_customer = c.id
    LEFT JOIN trans_order o ON p.id_order = o.id
    WHERE p.id = ?
  `, [id]);
  return result;
};

const createPickup = async (body) => {
  const values = [
    body.id_order,
    body.id_customer,
    body.pickup_date || new Date().toISOString().slice(0, 10),
    body.notes || null,
  ];

  const placeholders = fields.map(() => "?");
  const result = await query(
    `INSERT INTO trans_laundry_pickup (${fields.join(", ")}) VALUES (${placeholders.join(", ")})`,
    values
  );
  return result;
};

const updatePickupById = async (id, body) => {
  const fieldsUpdate = fields.map((field) => `${field} = ?`);
  const values = [
    body.id_order,
    body.id_customer,
    body.pickup_date || new Date().toISOString().slice(0, 10),
    body.notes || null,
    id,
  ];

  const result = await query(
    `UPDATE trans_laundry_pickup SET ${fieldsUpdate.join(", ")} WHERE id = ?`,
    values
  );
  return result;
};

const deletePickupById = async (id) => {
  const result = await query("DELETE FROM trans_laundry_pickup WHERE id = ?", [id]);
  return result;
};

export default {
  getAllPickups,
  getPickupById,
  createPickup,
  updatePickupById,
  deletePickupById,
};
