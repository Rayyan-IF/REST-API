import { STATUS_CODE } from "../config/statusCode.js";
import { createResponse } from "../utils/response.js";

export const errorHandler = (err, req, res, next ) => {
  if (err instanceof SyntaxError) return res.status(500).json(createResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, err.message));
  console.error(err)
  return res.status(400).json(createResponse(STATUS_CODE.BAD_REQUEST, err.message));
};