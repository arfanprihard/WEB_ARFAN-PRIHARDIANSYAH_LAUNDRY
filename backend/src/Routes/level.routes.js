import levelController from "../Controllers/level.controller.js";
import { Router } from "express";
import { authorizeRoles } from "../Middleware/auth.middleware.js";
import { ROLE_PERMISSIONS } from "../config/roles.js";

const router = Router();

router.use(authorizeRoles(...ROLE_PERMISSIONS.levels));

router.get("/", levelController.getAllLevels);
router.get("/:id", levelController.getLevelById);
router.post("/", levelController.createLevel);
router.patch("/:id", levelController.updateLevelById);
router.delete("/:id", levelController.deleteLevelById);

export { router as levelRoutes };
