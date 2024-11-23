import { database } from "../config/database.js"
import { STATUS_CODE } from "../config/statusCode.js"
import { createResponse } from "../utils/response.js"

export const getBanners = async (req, res) => {
  try {
    const banners = await database.query('SELECT banner_name, banner_image, description FROM banners')

    if (banners.rowCount === 0) return res.status(404).json(createResponse(STATUS_CODE.NOT_FOUND, "Banner tidak ditemukan"))

    res.status(200).json(createResponse(STATUS_CODE.SUCCESS, "Sukses", banners.rows))
  } catch (error) {
    console.error(error)
    res.status(500).json(createResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, "Gagal mendapatkan data banner."))
  }
}

export const getServices = async (req, res) => {
  try {
    const services = await database.query('SELECT service_code, service_name, service_icon, service_tariff FROM services')

    if (services.rowCount === 0) return res.status(404).json(createResponse(STATUS_CODE.NOT_FOUND, "Service tidak ditemukan"))

    res.status(200).json(createResponse(STATUS_CODE.SUCCESS, "Sukses", services.rows))
  } catch (error) {
    console.error(error)
    res.status(500).json(createResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, "Gagal mendapatkan data services."))
  }
}