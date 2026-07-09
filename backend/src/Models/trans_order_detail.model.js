import query from "../config/db.js";

const fields = ["id_order", "id_service", "qty", "amount", "notes"];

const getAllOrderDetails = async (id_order = null) => {
  let queryStr = `
    SELECT od.*, s.service_name, 
           CASE WHEN od.qty > 0 THEN od.amount / od.qty ELSE s.price END AS price, 
           o.order_code 
    FROM trans_order_detail od
    LEFT JOIN type_of_service s ON od.id_service = s.id
    LEFT JOIN trans_order o ON od.id_order = o.id
  `;
  const params = [];
  if (id_order !== null && id_order !== undefined && id_order !== "") {
    queryStr += " WHERE od.id_order = ?";
    params.push(id_order);
  }
  queryStr += " ORDER BY od.id DESC";

  const result = await query(queryStr, params);
  return result;
};

const getOrderDetailById = async (id) => {
  const result = await query(`
    SELECT od.*, s.service_name, 
           CASE WHEN od.qty > 0 THEN od.amount / od.qty ELSE s.price END AS price, 
           o.order_code 
    FROM trans_order_detail od
    LEFT JOIN type_of_service s ON od.id_service = s.id
    LEFT JOIN trans_order o ON od.id_order = o.id
    WHERE od.id = ?
  `, [id]);
  return result;
};

const createOrderDetail = async (body) => {
  const values = [
    body.id_order,
    body.id_service,
    body.qty,
    body.amount,
    body.notes || null,
  ];

  const placeholders = fields.map(() => "?");
  const result = await query(
    `INSERT INTO trans_order_detail (${fields.join(", ")}) VALUES (${placeholders.join(", ")})`,
    values
  );
  return result;
};

const updateOrderDetailById = async (id, body) => {
  const fieldsUpdate = fields.map((field) => `${field} = ?`);
  const values = [
    body.id_order,
    body.id_service,
    body.qty,
    body.amount,
    body.notes || null,
    id,
  ];

  const result = await query(
    `UPDATE trans_order_detail SET ${fieldsUpdate.join(", ")} WHERE id = ?`,
    values
  );
  return result;
};

const deleteOrderDetailById = async (id) => {
  const result = await query("DELETE FROM trans_order_detail WHERE id = ?", [id]);
  return result;
};

export default {
  getAllOrderDetails,
  getOrderDetailById,
  createOrderDetail,
  updateOrderDetailById,
  deleteOrderDetailById,
};
