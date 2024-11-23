import express from "express";
import userRoute from "./userRoute.js";

const router = express.Router();

router.use("/api", userRoute);

export default router;