import express from "express"
import { registration } from "../controllers/user.controller.js"
import { validateRegistration } from "../middleware/user.middleware.js"

const userRoute = express.Router()

userRoute.post("/registration", validateRegistration, registration)

export default userRoute