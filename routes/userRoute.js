import express from "express";
import { upload } from "../config/multer.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { validateRegistration, validateLogin, validateUpdateProfile } from "../middleware/userMiddleware.js";
import { registration, login, getProfile, updateProfile, updateProfileImage } from "../controllers/userController.js";

const userRoute = express.Router();

userRoute.get("/profile", verifyToken, getProfile)
userRoute.post("/login", validateLogin, login);
userRoute.post("/registration", validateRegistration, registration);
userRoute.put("/profile/update", verifyToken, validateUpdateProfile, updateProfile);
userRoute.put("/profile/image", verifyToken, upload.single('file'), updateProfileImage);

export default userRoute;
