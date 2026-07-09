import userController from "../Controllers/user.controller.js";
import { Router } from "express";
import { authorizeRoles } from "../Middleware/auth.middleware.js";
import { ROLE_PERMISSIONS } from "../config/roles.js";

const router = Router();

router.use(authorizeRoles(...ROLE_PERMISSIONS.users));

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser);
router.patch("/:id", userController.updateUserById);
router.delete("/:id", userController.deleteUserById);

export { router as userRoutes };
