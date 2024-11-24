import express from "express";
import router from "./routes/index.js";
import { STATUS_CODE } from "./config/statusCode.js";
import { createResponse } from "./utils/response.js";
import { errorHandler } from "./middleware/errorMiddleware.js"

const app = express();

app.use(express.json());

app.get("/", (req, res) => res.status(200).json(createResponse(STATUS_CODE.SUCCESS, "Web Service")))

app.use(express.static('public'))
app.use('/uploads', express.static('uploads'));

app.use(router);

app.use((req, res, next) => res.status(404).json(createResponse(404, "URL Not Found")));

// Generic error handler
app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`App running at port ${PORT}`));