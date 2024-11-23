import express from "express";
import userRoute from "./userRoute.js";
import infoRoute from "./infoRoute.js";
import transactionRoute from "./transactionRoute.js";

const router = express.Router();

router.use("/", userRoute);
router.use("/", infoRoute);
router.use("/", transactionRoute);

export default router;