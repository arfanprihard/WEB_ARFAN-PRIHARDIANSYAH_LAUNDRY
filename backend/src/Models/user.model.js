import { prisma } from "../config/db.js";

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    include: {
      level: true,
    },
    orderBy: {
      id: "desc",
    },
  });
  return users.map((u) => ({
    id: u.id,
    id_level: u.id_level,
    name: u.name,
    email: u.email,
    created_at: u.created_at,
    updated_at: u.updated_at,
    level_name: u.level?.level_name,
  }));
};

const getUserById = async (id) => {
  const u = await prisma.user.findFirst({
    where: {
      id: parseInt(id, 10),
    },
    include: {
      level: true,
    },
  });
  if (!u) return [];
  return [{
    id: u.id,
    id_level: u.id_level,
    name: u.name,
    email: u.email,
    created_at: u.created_at,
    updated_at: u.updated_at,
    level_name: u.level?.level_name,
  }];
};

const createUser = async (body) => {
  const user = await prisma.user.create({
    data: {
      id_level: parseInt(body.id_level, 10),
      name: body.name?.trim(),
      email: body.email?.trim(),
      password: body.password,
    },
  });
  return { insertId: user.id };
};

const updateUserById = async (id, body) => {
  try {
    const updateData = {
      id_level: parseInt(body.id_level, 10),
      name: body.name?.trim(),
      email: body.email?.trim(),
    };
    if (body.password !== undefined && body.password !== null && String(body.password).trim() !== "") {
      updateData.password = body.password;
    }
    const result = await prisma.user.updateMany({
      where: {
        id: parseInt(id, 10),
      },
      data: updateData,
    });
    return { affectedRows: result.count };
  } catch (error) {
    return { affectedRows: 0 };
  }
};

const deleteUserById = async (id) => {
  try {
    const result = await prisma.user.deleteMany({
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
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
};

