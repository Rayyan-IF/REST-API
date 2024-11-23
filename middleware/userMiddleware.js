import { createResponse } from "../utils/response.js";
import { STATUS_CODE } from "../config/statusCode.js";
import { registrationSchema, loginSchema, updateProfileSchema } from "../schemas/userSchema.js";

export const validateRegistration = async (req, res, next) => {
  try {
    await registrationSchema.validate(req.body);
    next();
  } catch (err) {
    res.status(400).json(createResponse(STATUS_CODE.BAD_REQUEST, err.message));
  }
};

export const validateLogin = async (req, res, next) => {
  try {
    await loginSchema.validate(req.body);
    next();
  } catch (err) {
    res.status(400).json(createResponse(STATUS_CODE.BAD_REQUEST, err.message));
  }
};

export const validateUpdateProfile = async (req, res, next) => {
  try {
    await updateProfileSchema.validate(req.body);
    next();
  } catch (err) {
    res.status(400).json(createResponse(STATUS_CODE.BAD_REQUEST, err.message));
  }
}