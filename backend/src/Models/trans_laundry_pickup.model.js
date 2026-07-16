import { prisma } from "../config/db.js";

const getAllPickups = async () => {
  const pickups = await prisma.transLaundryPickup.findMany({
    include: {
      customer: true,
      order: true,
    },
    orderBy: {
      id: "desc",
    },
  });
  return pickups.map((p) => ({
    id: p.id,
    id_order: p.id_order,
    id_customer: p.id_customer,
    pickup_date: p.pickup_date,
    notes: p.notes,
    created_at: p.created_at,
    updated_at: p.updated_at,
    customer_name: p.customer?.customer_name,
    order_code: p.order?.order_code,
  }));
};

const getPickupById = async (id) => {
  const p = await prisma.transLaundryPickup.findFirst({
    where: {
      id: parseInt(id, 10),
    },
    include: {
      customer: true,
      order: true,
    },
  });
  if (!p) return [];
  return [{
    id: p.id,
    id_order: p.id_order,
    id_customer: p.id_customer,
    pickup_date: p.pickup_date,
    notes: p.notes,
    created_at: p.created_at,
    updated_at: p.updated_at,
    customer_name: p.customer?.customer_name,
    order_code: p.order?.order_code,
  }];
};

const createPickup = async (body) => {
  const dateVal = body.pickup_date ? new Date(body.pickup_date) : new Date();
  const pickup = await prisma.transLaundryPickup.create({
    data: {
      id_order: parseInt(body.id_order, 10),
      id_customer: parseInt(body.id_customer, 10),
      pickup_date: dateVal,
      notes: body.notes || null,
    },
  });
  return { insertId: pickup.id };
};

const updatePickupById = async (id, body) => {
  try {
    const dateVal = body.pickup_date ? new Date(body.pickup_date) : new Date();
    const result = await prisma.transLaundryPickup.updateMany({
      where: {
        id: parseInt(id, 10),
      },
      data: {
        id_order: parseInt(body.id_order, 10),
        id_customer: parseInt(body.id_customer, 10),
        pickup_date: dateVal,
        notes: body.notes || null,
      },
    });
    return { affectedRows: result.count };
  } catch (error) {
    return { affectedRows: 0 };
  }
};

const deletePickupById = async (id) => {
  try {
    const result = await prisma.transLaundryPickup.deleteMany({
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
  getAllPickups,
  getPickupById,
  createPickup,
  updatePickupById,
  deletePickupById,
};

