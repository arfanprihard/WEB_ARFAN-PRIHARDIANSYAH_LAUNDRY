import trans_orderController from "../Controllers/trans_order.controller.js";
import { Router } from "express";
import { authorizeRoles } from "../Middleware/auth.middleware.js";
import { ROLE_PERMISSIONS } from "../config/roles.js";

const router = Router();

router.get("/", authorizeRoles(...ROLE_PERMISSIONS.ordersRead), trans_orderController.getAllOrders);
router.get("/:id", authorizeRoles(...ROLE_PERMISSIONS.ordersRead), trans_orderController.getOrderById);
router.post("/", authorizeRoles(...ROLE_PERMISSIONS.ordersWrite), trans_orderController.createOrder);
router.patch("/:id", authorizeRoles(...ROLE_PERMISSIONS.ordersWrite), trans_orderController.updateOrderById);
router.delete("/:id", authorizeRoles(...ROLE_PERMISSIONS.ordersWrite), trans_orderController.deleteOrderById);

export { router as transOrderRoutes };
