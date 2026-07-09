import query from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendSuccess, sendError } from "../Utils/response.helper.js";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return sendError(res, "Email and password are required.", null, 400);
    }

    const users = await query(
      `
      SELECT u.id, u.id_level, u.name, u.email, u.password, l.level_name 
      FROM user u
      LEFT JOIN level l ON u.id_level = l.id
      WHERE u.email = ?
    `,
      [email.trim()],
    );

    if (users.length === 0) {
      return sendError(res, "Invalid email or password.", null, 401);
    }

    const user = users[0];

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return sendError(res, "Invalid email or password.", null, 401);
    }

    const payload = {
      id: user.id,
      id_level: user.id_level,
      name: user.name,
      email: user.email,
      level_name: user.level_name,
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
        level_name: user.level_name,
      },
    });
  } catch (error) {
    return sendError(res, "Failed to login", error);
  }
};

export default {
  login,
};
