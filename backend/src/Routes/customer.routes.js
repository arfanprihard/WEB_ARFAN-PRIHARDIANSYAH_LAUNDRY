import express from "express";
import customerController from "../Controllers/customer.controller.js";
import { authorizeRoles } from "../Middleware/auth.middleware.js";
import { ROLE_PERMISSIONS } from "../config/roles.js";

const routes = express.Router();

routes.use(authorizeRoles(...ROLE_PERMISSIONS.customers));

routes.get("/", customerController.getAllCustomers);
routes.get("/:id", customerController.getCustomerById);
routes.patch("/:id", customerController.updateCustomerById);
routes.post("/", customerController.createCustomer);
routes.delete("/:id", customerController.deleteCustomerById);

export { routes as customerRoutes };
