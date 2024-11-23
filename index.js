import express from "express";
import router from "./routes/index.js";
import { globalErrorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(express.static('public'))
app.use('/uploads', express.static('uploads'));
  
app.use(express.json());
app.use(router);

app.use(globalErrorHandler)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`App running at port ${PORT}`));