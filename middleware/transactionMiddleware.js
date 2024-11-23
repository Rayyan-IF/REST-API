import { createResponse } from "../utils/response.js";
import { STATUS_CODE } from "../config/statusCode.js";
import { topupSchema } from "../schemas/transactionSchema.js";

export const validateTopup = async (req, res, next) => {
  try {
    await topupSchema.validate(req.body);
    next();
  } catch (err) {
    res.status(400).json(createResponse(STATUS_CODE.BAD_REQUEST, err.message));
  }
};