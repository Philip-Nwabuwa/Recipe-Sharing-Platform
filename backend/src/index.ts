import express from "express";
import http from "http";
import bodyPaser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db";
import router from "./router";

const app = express();
dotenv.config();

connectDB();

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyPaser.json());

app.use("/", router());

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default server;
