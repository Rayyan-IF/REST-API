import { createResponse } from "../utils/response.js"
import { userSchema } from "../schemas/user.schema.js"

export const validateRegistration = (req, res, next) => {
    try {
        userSchema.parse(req.body)
        next()
    } catch (err) {
        const errorMessage = err.errors.map((data) => data.message)
        res.status(400).json(createResponse(102, errorMessage))
    }
}