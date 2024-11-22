import pkg from "pg"
import dotenv from "dotenv"

dotenv.config()

const {Client} = pkg

export const database = new Client({
    user:process.env.user,
    port:process.env.port,
    host:process.env.host,
    password:process.env.password,
    database:process.env.database
})