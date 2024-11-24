import { database } from "../config/database.js";
import { createResponse } from "../utils/response.js";
import { STATUS_CODE } from "../config/statusCode.js";
import { paginationSchema } from "../schemas/paginationSchema.js";
import { topupSchema, paymentServiceSchema } from "../schemas/transactionSchema.js";

export const validateTopup = async (req, res, next) => {
  try {
    await topupSchema.validate(req.body);
    next();
  } catch (err) {
    res.status(400).json(createResponse(STATUS_CODE.BAD_REQUEST, err.message));
  }
};

export const validateService = async (req, res, next) => {
  try {
    await paymentServiceSchema.validate(req.body);

    const service = await database.query("SELECT service_id, service_code, service_name, service_tariff FROM services WHERE service_code = $1", [req.body.service_code])

    if (service.rowCount === 0) throw new Error("Service atau Layanan tidak ditemukan")

    req.service =  service.rows[0]
    next();
  } catch (err) {
    res.status(400).json(createResponse(STATUS_CODE.BAD_REQUEST, err.message));
  }
}

export const validateTransactionHistory = async (req, res, next) => {
  try {
    await paginationSchema.validate(req.query)
    next()
  } catch (err) {
    res.status(400).json(createResponse(STATUS_CODE.BAD_REQUEST, err.message));
  }
}