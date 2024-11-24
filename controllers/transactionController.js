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

    const serviceId = await client.query('SELECT service_id FROM services WHERE service_code = $1', ["TOPUP"])

    const { user_id, balance } = userBalance.rows[0]

    const newBalance = balance + req.body.top_up_amount

    const updatedBalance = await client.query('UPDATE balances SET balance = $1 WHERE balances.user_id = $2 RETURNING balance', [newBalance, user_id])

    const invoice_number = generateInvoiceNumber()

    await client.query('INSERT INTO transactions (user_id, service_id, transaction_type, invoice_number, total_amount) VALUES ($1, $2, $3, $4, $5)', [user_id, serviceId.rows[0].service_id, 'TOPUP', invoice_number, req.body.top_up_amount])

    await client.query('COMMIT')
    res.status(200).json(createResponse(STATUS_CODE.SUCCESS, "Top Up Balance berhasil", updatedBalance.rows[0]))
  } catch (error) {
    console.error(error)
    await client.query('ROLLBACK')
    res.status(500).json(createResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, "Gagal melakukan topup saldo."))
  } finally {
    client.release()
  }
}

export const paymentTransaction = async (req, res) => {
  const client = await database.connect()
  try {
    await client.query("BEGIN")

    const { service_id, service_code, service_name, service_tariff } = req.service

    const userBalance = await database.query(
      'SELECT users.user_id, balances.balance FROM users JOIN balances ON users.user_id = balances.user_id WHERE email = $1', [req.email]
    )
    
    const { user_id, balance } = userBalance.rows[0]
    
    if (balance < service_tariff) {
      await client.query("ROLLBACK")
      return res.status(400).json(createResponse(STATUS_CODE.BAD_REQUEST, "Saldo tidak mencukupi"))
    }

    const newBalance = balance - service_tariff

    await client.query("UPDATE balances SET balance = $1 WHERE user_id = $2", [newBalance, user_id])

    const invoice_number = generateInvoiceNumber()

    const transactionResult = await client.query('INSERT INTO transactions (user_id, service_id, transaction_type, invoice_number, total_amount) VALUES ($1, $2, $3, $4, $5) RETURNING invoice_number, transaction_type, created_at AS created_on', [user_id, service_id, 'PAYMENT', invoice_number, service_tariff])

    const payload = { service_code, service_name, total_amount: service_tariff, ...transactionResult.rows[0] }

    await client.query('COMMIT')
    res.status(200).json(createResponse(STATUS_CODE.SUCCESS, "Transaksi berhasil", payload))
  } catch (error) {
    console.error(error)
    await client.query("ROLLBACK")
    res.status(500).json(createResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, "Gagal melakukan transaksi."))
  } finally {
    client.release()
  }
}

export const getTransactionHistory = async (req, res) => {
  try {
    const { offset = 0, limit } = req.query

    let payload = { offset, limit, records:[] }

    const baseQuery = "SELECT transactions.invoice_number, transactions.transaction_type, transactions.total_amount, transactions.created_at AS created_on, services.service_name AS description FROM transactions JOIN services ON transactions.service_id = services.service_id WHERE transactions.user_id = $1 ORDER BY transactions.created_at DESC"

    if (!limit) {
      const trxHistory = await database.query(baseQuery + " OFFSET $2", [req.user_id, offset])

      if (trxHistory.rowCount > 0) {
        payload.limit = trxHistory.rowCount
        payload.records = trxHistory.rows
      }

      return res.status(200).json(createResponse(STATUS_CODE.SUCCESS, "Get History Berhasil", payload))
    }

    const trxHistory = await database.query(baseQuery + " LIMIT $2 OFFSET $3", [req.user_id, limit, offset])

    if (trxHistory.rowCount > 0) payload.records = trxHistory.rows

    res.status(200).json(createResponse(STATUS_CODE.SUCCESS, "Get History berhasil", payload))
  } catch (error) {
    console.error(error)
    res.status(500).json(createResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, "Gagal mendapatkan data transaksi."))
  }
}