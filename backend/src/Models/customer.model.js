import { prisma } from "../config/db.js";

const getAllCustomers = async () => {
  return await prisma.customer.findMany({
    where: {
      deleted_at: null,
    },
    orderBy: {
      id: "desc",
    },
    take: 5,
  });
};

const getCustomerById = async (id) => {
  const customer = await prisma.customer.findFirst({
    where: {
      id: parseInt(id, 10),
      deleted_at: null,
    },
  });
  return customer ? [customer] : [];
};

const updateCustomerById = async (id, body) => {
  try {
    const customer = await prisma.customer.updateMany({
      where: {
        id: parseInt(id, 10),
        deleted_at: null,
      },
      data: {
        customer_name: body.customer_name?.trim(),
        phone: body.phone?.trim() || null,
        address: body.address?.trim() || null,
      },
    });
    return { affectedRows: customer.count };
  } catch (error) {
    return { affectedRows: 0 };
  }
};

const createCustomer = async (body) => {
  const customer = await prisma.customer.create({
    data: {
      customer_name: body.customer_name?.trim(),
      phone: body.phone?.trim() || null,
      address: body.address?.trim() || null,
    },
  });
  return { insertId: customer.id };
};

const deleteCustomerById = async (id) => {
  try {
    const customer = await prisma.customer.updateMany({
      where: {
        id: parseInt(id, 10),
        deleted_at: null,
      },
      data: {
        deleted_at: new Date(),
      },
    });
    return { affectedRows: customer.count };
  } catch (error) {
    return { affectedRows: 0 };
  }
};

export default {
  getAllCustomers,
  updateCustomerById,
  createCustomer,
  deleteCustomerById,
  getCustomerById,
};

