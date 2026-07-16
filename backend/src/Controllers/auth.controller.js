import { prisma } from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendSuccess, sendError } from "../Utils/response.helper.js";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return sendError(res, "Email and password are required.", null, 400);
    }

    const user = await prisma.user.findFirst({
      where: {
        email: email.trim(),
      },
      include: {
        level: true,
      },
    });

    if (!user) {
      return sendError(res, "Invalid email or password.", null, 401);
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return sendError(res, "Invalid email or password.", null, 401);
    }

    const payload = {
      id: user.id,
      id_level: user.id_level,
      name: user.name,
      email: user.email,
      level_name: user.level?.level_name,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return sendSuccess(res, "Login successful.", {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        level_name: user.level?.level_name,
      },
    });
  } catch (error) {
    return sendError(res, "Failed to login", error);
  }
};

export default {
  login,
};

