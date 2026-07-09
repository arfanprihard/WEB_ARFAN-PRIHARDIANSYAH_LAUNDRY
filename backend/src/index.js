import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { customerRoutes } from "./Routes/customer.routes.js";
import { levelRoutes } from "./Routes/level.routes.js";
import { typeOfServiceRoutes } from "./Routes/type_of_service.routes.js";
import { transOrderRoutes } from "./Routes/trans_order.routes.js";
import { transOrderDetailRoutes } from "./Routes/trans_order_detail.routes.js";
import { transLaundryPickupRoutes } from "./Routes/trans_laundry_pickup.routes.js";
import { userRoutes } from "./Routes/user.routes.js";
import { authRoutes } from "./Routes/auth.routes.js";
import { verifyJWT } from "./Middleware/auth.middleware.js";

const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/customers", verifyJWT, customerRoutes);
app.use("/api/levels", verifyJWT, levelRoutes);
app.use("/api/type-of-service", verifyJWT, typeOfServiceRoutes);
app.use("/api/trans-orders", verifyJWT, transOrderRoutes);
app.use("/api/trans-order-details", verifyJWT, transOrderDetailRoutes);
app.use("/api/trans-laundry-pickups", verifyJWT, transLaundryPickupRoutes);
app.use("/api/users", verifyJWT, userRoutes);

app.use("/", (req, res) => {
  res.status(404).json({
    message: "Endpoint not Found",
  });
});

app.listen(PORT, () => console.log("Running on port " + PORT));
