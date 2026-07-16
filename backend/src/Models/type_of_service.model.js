import { prisma } from "../config/db.js";

const getAllTypeOfServices = async () => {
  return await prisma.typeOfService.findMany({
    where: {
      deleted_at: null,
    },
  });
};

const getTypeOfServiceById = async (id) => {
  const service = await prisma.typeOfService.findFirst({
    where: {
      id: parseInt(id, 10),
      deleted_at: null,
    },
  });
  return service ? [service] : [];
};

const createTypeOfService = async (body) => {
  const service = await prisma.typeOfService.create({
    data: {
      service_name: body.service_name?.trim(),
      price: body.price,
      description: body.description?.trim() || null,
    },
  });
  return { insertId: service.id };
};

const updateTypeOfServiceById = async (id, body) => {
  try {
    const service = await prisma.typeOfService.updateMany({
      where: {
        id: parseInt(id, 10),
        deleted_at: null,
      },
      data: {
        service_name: body.service_name?.trim(),
        price: body.price,
        description: body.description?.trim() || null,
      },
    });
    return { affectedRows: service.count };
  } catch (error) {
    return { affectedRows: 0 };
  }
};

const deleteTypeOfServiceById = async (id) => {
  try {
    const service = await prisma.typeOfService.updateMany({
      where: {
        id: parseInt(id, 10),
        deleted_at: null,
      },
      data: {
        deleted_at: new Date(),
      },
    });
    return { affectedRows: service.count };
  } catch (error) {
    return { affectedRows: 0 };
  }
};

export default {
  getAllTypeOfServices,
  getTypeOfServiceById,
  createTypeOfService,
  updateTypeOfServiceById,
  deleteTypeOfServiceById,
};

