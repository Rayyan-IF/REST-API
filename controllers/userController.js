import fs from "fs"
import path from "path";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { database } from "../config/database.js";
import { createResponse } from "../utils/response.js";
import { STATUS_CODE } from "../config/statusCode.js";

export const registration = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    const isUsedEmail = await database.query('SELECT email FROM users WHERE email = $1', [email])
    if (isUsedEmail.rowCount > 0) return res.status(400).json(createResponse(STATUS_CODE.BAD_REQUEST, "Email sudah terdaftar"))

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    await database.query(
      "INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4)",
      [email, hashedPassword, first_name, last_name]
    );

    res.status(200).json(createResponse(STATUS_CODE.SUCCESS, "Registrasi berhasil silahkan login"));
  } catch (error) {
    res.status(500).json(createResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, "Terjadi kesalahan saat memproses registrasi"));
  }
};

export const login = async (req, res) => {
  try {
    const UNAUTHORIZED_MESSAGE = "Username atau password salah"

    const isUserExist = await database.query("SELECT * FROM users WHERE email = $1", [req.body.email])
    if (isUserExist.rows.length === 0) return res.status(401).json(createResponse(STATUS_CODE.UNAUTHORIZED, UNAUTHORIZED_MESSAGE))
    
    const isMatchPassword = await bcrypt.compare(req.body.password, isUserExist.rows[0].password)
    if(!isMatchPassword) return res.status(401).json(createResponse(STATUS_CODE.UNAUTHORIZED, UNAUTHORIZED_MESSAGE))

    const { user_id, email } = isUserExist.rows[0]

    const accessToken = jsonwebtoken.sign({user_id, email}, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "12h"
    }) 

    res.status(200).json(createResponse(STATUS_CODE.SUCCESS, "Login Sukses", {
      token: accessToken
    }))
  } catch (error) {
    res.status(500).json(createResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, "Terjadi kesalahan saat login."))
  }
}

export const getProfile = async (req, res) => {
  try {
    const isUserExist = await database.query('SELECT email, first_name, last_name, profile_image FROM users WHERE email = $1', [req.email])

    if (isUserExist.rows.length === 0) return res.status(404).json(createResponse(STATUS_CODE.NOT_FOUND, "Pengguna tidak ditemukan"))

    const payload = isUserExist.rows[0]
    
    res.status(200).json(createResponse(STATUS_CODE.SUCCESS, "Sukses", payload))
  } catch (error) {
    res.status(500).json(createResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, "Terjadi kesalahan mengakses profile"))
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { first_name, last_name } = req.body

    const isUserExist = await database.query('SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)', [req.email])
    if (!isUserExist.rows[0].exists) return res.status(401).json(createResponse(STATUS_CODE.UNAUTHORIZED, "Pengguna tidak ditemukan"))

    const updatedUser = await database.query('UPDATE users SET first_name = $1, last_name = $2 WHERE email = $3 RETURNING email, first_name, last_name, profile_image', [first_name, last_name, req.email])
    if (updatedUser.rowCount === 0) return res.status(500).json(createResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, "Terjadi kesalahan saat update profile."))

    res.status(200).json(createResponse(STATUS_CODE.SUCCESS, "Sukses", updatedUser.rows[0]))
  } catch (error) {
    res.status(500).json(createResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, "Terjadi kesalahan saat update profile."))
  }
}

export const updateProfileImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json(createResponse(STATUS_CODE.BAD_REQUEST, "Field file tidak boleh kosong"));

    const profileImageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const currentUser = await database.query('SELECT profile_image FROM users WHERE email = $1', [req.email])
    if (currentUser.rowCount === 0) return res.status(404).json(createResponse(STATUS_CODE.NOT_FOUND, "Pengguna tidak ditemukan"))
    
    const currentImageUrl = currentUser.rows[0].profile_image

    const updatedUser = await database.query('UPDATE users SET profile_image = $1 WHERE email = $2 RETURNING email, first_name, last_name, profile_image', [profileImageUrl, req.email])
    if (updatedUser.rowCount === 0) return res.status(500).json(createResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, "Terjadi kesalahan saat update foto profile."))

    if (currentImageUrl) {
      const filePath = path.join('uploads', path.basename(currentImageUrl))
      fs.unlink(filePath, (err) => {
        if (err) console.error (`Gagal menghapus file: ${filePath}`, err)
      })
    }

    res.status(200).json(createResponse(STATUS_CODE.SUCCESS, "Sukses", updatedUser.rows[0]))
  } catch (error) {
    res.status(500).json(createResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, "Terjadi kesalahan saat upload foto profile."))
  }
}