import express from "express"
import router from "./routes/index.js"
import { database }  from "./config/database.js"

const app = express()

database.connect()
        .then(() => console.log(`Connected to database successfully`))
        .catch((error) => console.log(`Database connection failed:`, error))

app.use(express.json())
app.use(router)

app.listen(5000, () => console.log(`App running at port 5000`))