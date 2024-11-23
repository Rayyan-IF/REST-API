import { database } from "../config/database.js"
import { createResponse } from "../utils/response.js"
import { STATUS_CODE } from "../config/statusCode.js"

const generateInvoiceNumber = () => `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`

export const getBalance = async (req, res) => {
  try {
    const userBalance = await database.query('SELECT balance FROM balances JOIN users ON users.user_id = balances.user_id WHERE users.email = $1', [req.email])

    if (userBalance.rowCount === 0) return res.status(404).json(createResponse(STATUS_CODE.NOT_FOUND, "Pengguna tidak ditemukan"))

    res.status(200).json(createResponse(STATUS_CODE.SUCCESS, "Sukses", userBalance.rows[0]))
  } catch (error) {
    console.error(error)
    res.status(500).json(createResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, "Gagal mendapatkan data saldo."))
  }
}

export const topup = async (req, res) => {
  const client = await database.connect()
  try {
    await client.query('BEGIN')

    const userBalance = await client.query('SELECT users.user_id, balance FROM balances JOIN users ON users.user_id = balances.user_id WHERE users.email = $1', [req.email])

    if (userBalance.rowCount === 0) {
      await client.query('ROLLBACK')
      return res.status(404).json(createResponse(STATUS_CODE.NOT_FOUND, "Pengguna tidak ditemukan"))
    }

    const { user_id, balance } = userBalance.rows[0]

    const newBalance = Number(balance) + req.body.top_up_amount

    const updatedBalance = await client.query('UPDATE balances SET balance = $1 WHERE balances.user_id = $2 RETURNING balance', [newBalance, user_id])

    const invoice_number = generateInvoiceNumber()

    await client.query('INSERT INTO transactions (user_id, transaction_type, invoice_number, total_amount) VALUES ($1, $2, $3, $4)', [user_id, 'TOPUP', invoice_number, req.body.top_up_amount])

    await client.query('COMMIT')
    res.status(200).json(createResponse(STATUS_CODE.SUCCESS, "Top Up Balance berhasil", Number(updatedBalance.rows[0].balance)))
  } catch (error) {
    console.error(error)
    await client.query('ROLLBACK')
    res.status(500).json(createResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, "Gagal melakukan topup saldo."))
  } finally {
    client.release()
  }
}