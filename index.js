import express from "express";
import router from "./routes/index.js";
import { errorHandler } from "./middleware/errorMiddleware.js"

const app = express();

app.use(express.static('public'))
app.use('/uploads', express.static('uploads'));
  
app.use(express.json());
app.use(router);

// Generic error handler
app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`App running at port ${PORT}`));