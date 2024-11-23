import express from "express";
import userRoute from "./userRoute.js";
import infoRoute from "./infoRoute.js";

const router = express.Router();

router.use("/", userRoute);
router.use("/", infoRoute);

export default router;