import jwt from "jsonwebtoken";
import { sendError } from "../Utils/response.helper.js";

export const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return sendError(res, "Access denied. No token provided.", null, 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return sendError(res, "Invalid or expired token.", error, 401);
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.level_name;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return sendError(res, "Access denied. Forbidden.", null, 403);
    }
    next();
  };
};
