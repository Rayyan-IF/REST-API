import jsonwebtoken from "jsonwebtoken"
import { createResponse } from "../utils/response.js";
import { STATUS_CODE } from "../config/statusCode.js";

export const verifyToken = (req, res, next) => {
  const INVALID_TOKEN_MESSAGE = "Token tidak valid atau kadaluwarsa"

  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(" ")[1]
  if (!token) return res.status(401).json(createResponse(STATUS_CODE.UNAUTHORIZED, INVALID_TOKEN_MESSAGE))
  
  jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
    if (err) return res.status(401).json(createResponse(STATUS_CODE.UNAUTHORIZED, INVALID_TOKEN_MESSAGE))
    req.user_id = decode.user_id
    req.email = decode.email
    next()
  })
}