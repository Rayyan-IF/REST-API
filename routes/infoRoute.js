import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getBanners, getServices } from "../controllers/infoController.js";

const infoRoute = express.Router();

infoRoute.get("/banner", getBanners)
infoRoute.get("/services", verifyToken, getServices)

export default infoRoute;
