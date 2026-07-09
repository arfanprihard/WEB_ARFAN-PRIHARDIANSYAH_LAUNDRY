import trans_order_detailController from "../Controllers/trans_order_detail.controller.js";
import { Router } from "express";
import { authorizeRoles } from "../Middleware/auth.middleware.js";
import { ROLE_PERMISSIONS } from "../config/roles.js";

const router = Router();

router.use(authorizeRoles(...ROLE_PERMISSIONS.orderDetails));

router.get("/", trans_order_detailController.getAllOrderDetails);
router.get("/:id", trans_order_detailController.getOrderDetailById);
router.post("/", trans_order_detailController.createOrderDetail);
router.patch("/:id", trans_order_detailController.updateOrderDetailById);
router.delete("/:id", trans_order_detailController.deleteOrderDetailById);

export { router as transOrderDetailRoutes };
