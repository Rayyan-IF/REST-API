import bcrypt from "bcrypt"
import jsonwebtoken from "jsonwebtoken"
import { database } from "../config/database.js"
import { createResponse } from "../utils/response.js"

export const registration = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)
        await database.query('INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4)', 
                              [email, hashedPassword, first_name, last_name])
        res.status(201).json(createResponse(0, "Registrasi berhasil silahkan login"))
    } catch (error) {
        res.status(500).json(createResponse(100, error.detail))
    }
}