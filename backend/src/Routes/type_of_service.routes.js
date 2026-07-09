import type_of_serviceController from "../Controllers/type_of_service.controller.js";
import { Router } from "express";
import { authorizeRoles } from "../Middleware/auth.middleware.js";
import { ROLE_PERMISSIONS } from "../config/roles.js";

const router = Router();

router.get("/", authorizeRoles(...ROLE_PERMISSIONS.servicesRead), type_of_serviceController.getAllTypeOfServices);
router.get("/:id", authorizeRoles(...ROLE_PERMISSIONS.servicesRead), type_of_serviceController.getTypeOfServiceById);
router.post("/", authorizeRoles(...ROLE_PERMISSIONS.servicesWrite), type_of_serviceController.createTypeOfService);
router.patch("/:id", authorizeRoles(...ROLE_PERMISSIONS.servicesWrite), type_of_serviceController.updateTypeOfServiceById);
router.delete("/:id", authorizeRoles(...ROLE_PERMISSIONS.servicesWrite), type_of_serviceController.deleteTypeOfServiceById);

export { router as typeOfServiceRoutes };
