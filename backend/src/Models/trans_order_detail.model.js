import { prisma } from "../config/db.js";

const getAllOrderDetails = async (id_order = null) => {
  const whereClause = {};
  if (id_order !== null && id_order !== undefined && id_order !== "") {
    whereClause.id_order = parseInt(id_order, 10);
  }

  const details = await prisma.transOrderDetail.findMany({
    where: whereClause,
    include: {
      service: true,
      order: true,
    },
    orderBy: {
      id: "desc",
    },
  });

  return details.map((od) => {
    let price = od.service?.price || 0;
    if (od.qty > 0 && od.amount !== null && od.amount !== undefined) {
      price = Number(od.amount) / od.qty;
    }

    return {
      id: od.id,
      id_order: od.id_order,
      id_service: od.id_service,
      qty: od.qty,
      amount: od.amount,
      notes: od.notes,
      created_at: od.created_at,
      updated_at: od.updated_at,
      service_name: od.service?.service_name,
      price: price,
      order_code: od.order?.order_code,
    };
  });
};

const getOrderDetailById = async (id) => {
  const od = await prisma.transOrderDetail.findFirst({
    where: {
      id: parseInt(id, 10),
    },
    include: {
      service: true,
      order: true,
    },
  });

  if (!od) return [];

  let price = od.service?.price || 0;
  if (od.qty > 0 && od.amount !== null && od.amount !== undefined) {
    price = Number(od.amount) / od.qty;
  }

  return [{
    id: od.id,
    id_order: od.id_order,
    id_service: od.id_service,
    qty: od.qty,
    amount: od.amount,
    notes: od.notes,
    created_at: od.created_at,
    updated_at: od.updated_at,
    service_name: od.service?.service_name,
    price: price,
    order_code: od.order?.order_code,
  }];
};

const createOrderDetail = async (body) => {
  const od = await prisma.transOrderDetail.create({
    data: {
      id_order: parseInt(body.id_order, 10),
      id_service: parseInt(body.id_service, 10),
      qty: parseInt(body.qty, 10),
      amount: body.amount,
      notes: body.notes || null,
    },
  });
  return { insertId: od.id };
};

const updateOrderDetailById = async (id, body) => {
  try {
    const result = await prisma.transOrderDetail.updateMany({
      where: {
        id: parseInt(id, 10),
      },
      data: {
        id_order: parseInt(body.id_order, 10),
        id_service: parseInt(body.id_service, 10),
        qty: parseInt(body.qty, 10),
        amount: body.amount,
        notes: body.notes || null,
      },
    });
    return { affectedRows: result.count };
  } catch (error) {
    return { affectedRows: 0 };
  }
};

const deleteOrderDetailById = async (id) => {
  try {
    const result = await prisma.transOrderDetail.deleteMany({
      where: {
        id: parseInt(id, 10),
      },
    });
    return { affectedRows: result.count };
  } catch (error) {
    return { affectedRows: 0 };
  }
};

export default {
  getAllOrderDetails,
  getOrderDetailById,
  createOrderDetail,
  updateOrderDetailById,
  deleteOrderDetailById,
};

