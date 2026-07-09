import query from "../config/db.js";

const fields = [
  "id_customer",
  "order_code",
  "order_date",
  "order_qty",
  "order_total",
  "order_change",
  "total",
  "payment_status",
];

const getAllOrders = async () => {
  const result = await query(`
    SELECT o.*, c.customer_name,
           CASE WHEN p.id IS NOT NULL THEN 1 ELSE 0 END AS order_status,
           GROUP_CONCAT(s.service_name SEPARATOR ', ') AS service_names
    FROM trans_order o
    LEFT JOIN customer c ON o.id_customer = c.id
    LEFT JOIN trans_laundry_pickup p ON o.id = p.id_order
    LEFT JOIN trans_order_detail od ON o.id = od.id_order
    LEFT JOIN type_of_service s ON od.id_service = s.id
    WHERE o.deleted_at IS NULL
    GROUP BY o.id
    ORDER BY o.id DESC
  `);
  return result;
};

const getOrderById = async (id) => {
  const result = await query(`
    SELECT o.*, c.customer_name,
           CASE WHEN p.id IS NOT NULL THEN 1 ELSE 0 END AS order_status,
           GROUP_CONCAT(s.service_name SEPARATOR ', ') AS service_names
    FROM trans_order o
    LEFT JOIN customer c ON o.id_customer = c.id
    LEFT JOIN trans_laundry_pickup p ON o.id = p.id_order
    LEFT JOIN trans_order_detail od ON o.id = od.id_order
    LEFT JOIN type_of_service s ON od.id_service = s.id
    WHERE o.id = ? AND o.deleted_at IS NULL
    GROUP BY o.id
  `, [id]);
  return result;
};

const createOrder = async (body) => {
  const orderDate = body.order_date || new Date().toISOString().slice(0, 10);
  const dateStr = orderDate.replace(/-/g, "");
  const prefix = `LAUNDRY-${dateStr}-`;

  // Find the last order code for this day to increment it sequentially
  const queryResult = await query(
    `SELECT order_code FROM trans_order WHERE order_code LIKE ? ORDER BY order_code DESC LIMIT 1`,
    [`${prefix}%`]
  );

  let nextNum = 1;
  if (queryResult && queryResult.length > 0) {
    const lastCode = queryResult[0].order_code;
    const parts = lastCode.split("-");
    const lastNum = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(lastNum)) {
      nextNum = lastNum + 1;
    }
  }
  const generatedOrderCode = `${prefix}${String(nextNum).padStart(4, "0")}`;

  const values = [
    body.id_customer,
    generatedOrderCode,
    orderDate,
    body.order_qty,
    body.order_total,
    body.order_change || 0,
    body.total || 0,
    body.payment_status || "Lunas",
  ];

  const placeholders = fields.map(() => "?");
  const result = await query(
    `INSERT INTO trans_order (${fields.join(", ")}) VALUES (${placeholders.join(", ")})`,
    values
  );

  // Attach the generated order code to the returned result so the controller can send it back
  result.order_code = generatedOrderCode;
  return result;
};

const updateOrderById = async (id, body) => {
  const fieldsUpdate = fields.map((field) => `${field} = ?`);
  const values = [
    body.id_customer,
    body.order_code?.trim(),
    body.order_date || new Date().toISOString().slice(0, 10),
    body.order_qty,
    body.order_total,
    body.order_change || 0,
    body.total || 0,
    body.payment_status || "Lunas",
    id,
  ];

  const result = await query(
    `UPDATE trans_order SET ${fieldsUpdate.join(", ")} WHERE id = ?`,
    values
  );
  return result;
};

const deleteOrderById = async (id) => {
  const result = await query("UPDATE trans_order SET deleted_at = NOW() WHERE id = ?", [id]);
  return result;
};

export default {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderById,
  deleteOrderById,
};
