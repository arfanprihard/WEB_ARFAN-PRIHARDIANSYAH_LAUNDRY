import { prisma } from "../config/db.js";

const getLevelById = async (id) => {
  const level = await prisma.level.findFirst({
    where: {
      id: parseInt(id, 10),
      deleted_at: null,
    },
  });
  return level ? [level] : [];
};

const getAllLevels = async () => {
  return await prisma.level.findMany({
    where: {
      deleted_at: null,
    },
    orderBy: {
      id: "desc",
    },
  });
};

const createLevel = async (body) => {
  const level = await prisma.level.create({
    data: {
      level_name: body.level_name,
    },
  });
  return { insertId: level.id };
};

const updateLevelById = async (id, body) => {
  try {
    const level = await prisma.level.updateMany({
      where: {
        id: parseInt(id, 10),
        deleted_at: null,
      },
      data: {
        level_name: body.level_name,
      },
    });
    return { affectedRows: level.count };
  } catch (error) {
    return { affectedRows: 0 };
  }
};

const deleteLevelById = async (id) => {
  try {
    const level = await prisma.level.updateMany({
      where: {
        id: parseInt(id, 10),
        deleted_at: null,
      },
      data: {
        deleted_at: new Date(),
      },
    });
    return { affectedRows: level.count };
  } catch (error) {
    return { affectedRows: 0 };
  }
};

export default {
  getLevelById,
  getAllLevels,
  updateLevelById,
  deleteLevelById,
  createLevel,
};

