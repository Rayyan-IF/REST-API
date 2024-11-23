import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { validateTopup } from "../middleware/transactionMiddleware.js";
import { getBalance, topup } from "../controllers/transactionController.js";

const transactionRoute = express.Router();

transactionRoute.get("/balance", verifyToken, getBalance)
transactionRoute.post("/topup", verifyToken, validateTopup, topup)

export default transactionRoute;