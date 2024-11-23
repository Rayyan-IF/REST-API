import express from "express";
import router from "./routes/index.js";
import { database } from "./config/database.js";
import { globalErrorHandler } from "./middleware/errorHandler.js";

const app = express();

database
  .connect()
  .then(() => console.log("Connected to database successfully"))
  .catch((error) => console.error("Database connection failed:", error));

  app.use(express.static('public'))
  app.use('/uploads', express.static('uploads'));
  
  app.use(express.json());
  app.use(router);

  app.use(globalErrorHandler)

app.listen(5000, () => console.log("App running at port 5000"));