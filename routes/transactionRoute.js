import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { validateTopup, validateService, validateTransactionHistory } from "../middleware/transactionMiddleware.js";
import { getBalance, topup, paymentTransaction, getTransactionHistory } from "../controllers/transactionController.js";

const transactionRoute = express.Router();

transactionRoute.get("/balance", verifyToken, getBalance)
transactionRoute.post("/topup", verifyToken, validateTopup, topup)
transactionRoute.post("/transaction", verifyToken, validateService, paymentTransaction)
transactionRoute.get("/transaction/history", verifyToken, validateTransactionHistory, getTransactionHistory )

export default transactionRoute;