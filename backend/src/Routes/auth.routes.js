import authController from "../Controllers/auth.controller.js";
import { Router } from "express";

const router = Router();

router.post("/login", authController.login);

export { router as authRoutes };
