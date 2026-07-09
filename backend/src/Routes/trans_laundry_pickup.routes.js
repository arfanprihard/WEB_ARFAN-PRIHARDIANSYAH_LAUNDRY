import trans_laundry_pickupController from "../Controllers/trans_laundry_pickup.controller.js";
import { Router } from "express";
import { authorizeRoles } from "../Middleware/auth.middleware.js";
import { ROLE_PERMISSIONS } from "../config/roles.js";

const router = Router();

router.use(authorizeRoles(...ROLE_PERMISSIONS.pickups));

router.get("/", trans_laundry_pickupController.getAllPickups);
router.get("/:id", trans_laundry_pickupController.getPickupById);
router.post("/", trans_laundry_pickupController.createPickup);
router.patch("/:id", trans_laundry_pickupController.updatePickupById);
router.delete("/:id", trans_laundry_pickupController.deletePickupById);

export { router as transLaundryPickupRoutes };
