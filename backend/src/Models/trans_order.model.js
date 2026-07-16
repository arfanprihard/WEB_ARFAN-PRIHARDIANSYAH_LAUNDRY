import { prisma } from "../config/db.js";

const getAllOrders = async () => {
  const orders = await prisma.transOrder.findMany({
    where: {
      deleted_at: null,
    },
    include: {
      customer: true,
      pickups: true,
      details: {
        include: {
          service: true,
        },
      },
    },
    orderBy: {
      id: "desc",
    },
  });

  return orders.map((o) => {
    const serviceNames = o.details
      .map((d) => d.service?.service_name)
      .filter(Boolean)
      .join(", ");

    return {
      id: o.id,
      id_customer: o.id_customer,
      order_code: o.order_code,
      order_date: o.order_date,
      order_qty: o.order_qty,
      order_total: o.order_total,
      created_at: o.created_at,
      updated_at: o.updated_at,
      deleted_at: o.deleted_at,
      order_change: o.order_change,
      total: o.total,
      payment_status: o.payment_status,
      customer_name: o.customer?.customer_name,
      order_status: o.pickups.length > 0 ? 1 : 0,
      service_names: serviceNames || null,
    };
  });
};

const getOrderById = async (id) => {
  const o = await prisma.transOrder.findFirst({
    where: {
      id: parseInt(id, 10),
      deleted_at: null,
    },
    include: {
      customer: true,
      pickups: true,
      details: {
        include: {
          service: true,
        },
      },
    },
  });

  if (!o) return [];

  const serviceNames = o.details
    .map((d) => d.service?.service_name)
    .filter(Boolean)
    .join(", ");

  return [{
    id: o.id,
    id_customer: o.id_customer,
    order_code: o.order_code,
    order_date: o.order_date,
    order_qty: o.order_qty,
    order_total: o.order_total,
    created_at: o.created_at,
    updated_at: o.updated_at,
    deleted_at: o.deleted_at,
    order_change: o.order_change,
    total: o.total,
    payment_status: o.payment_status,
    customer_name: o.customer?.customer_name,
    order_status: o.pickups.length > 0 ? 1 : 0,
    service_names: serviceNames || null,
  }];
};

const createOrder = async (body) => {
  const orderDateStr = body.order_date || new Date().toISOString().slice(0, 10);
  const orderDateVal = new Date(orderDateStr);
  const dateStr = orderDateStr.replace(/-/g, "");
  const prefix = `LAUNDRY-${dateStr}-`;

  const lastOrder = await prisma.transOrder.findFirst({
    where: {
      order_code: {
        startsWith: prefix,
      },
    },
    orderBy: {
      order_code: "desc",
    },
    select: {
      order_code: true,
    },
  });

  let nextNum = 1;
  if (lastOrder && lastOrder.order_code) {
    const parts = lastOrder.order_code.split("-");
    const lastNum = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(lastNum)) {
      nextNum = lastNum + 1;
    }
  }
  const generatedOrderCode = `${prefix}${String(nextNum).padStart(4, "0")}`;

  const order = await prisma.transOrder.create({
    data: {
      id_customer: parseInt(body.id_customer, 10),
      order_code: generatedOrderCode,
      order_date: orderDateVal,
      order_qty: parseInt(body.order_qty, 10),
      order_total: body.order_total,
      order_change: body.order_change || 0,
      total: body.total || 0,
      payment_status: body.payment_status || "Lunas",
    },
  });

  return {
    insertId: order.id,
    order_code: generatedOrderCode,
  };
};

const updateOrderById = async (id, body) => {
  try {
    const orderDateStr = body.order_date || new Date().toISOString().slice(0, 10);
    const orderDateVal = new Date(orderDateStr);
    const result = await prisma.transOrder.updateMany({
      where: {
        id: parseInt(id, 10),
      },
      data: {
        id_customer: parseInt(body.id_customer, 10),
        order_code: body.order_code?.trim(),
        order_date: orderDateVal,
        order_qty: parseInt(body.order_qty, 10),
        order_total: body.order_total,
        order_change: body.order_change || 0,
        total: body.total || 0,
        payment_status: body.payment_status || "Lunas",
      },
    });
    return { affectedRows: result.count };
  } catch (error) {
    return { affectedRows: 0 };
  }
};

const deleteOrderById = async (id) => {
  try {
    const result = await prisma.transOrder.updateMany({
      where: {
        id: parseInt(id, 10),
      },
      data: {
        deleted_at: new Date(),
      },
    });
    return { affectedRows: result.count };
  } catch (error) {
    return { affectedRows: 0 };
  }
};

export default {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderById,
  deleteOrderById,
};

