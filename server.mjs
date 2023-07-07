import express, { json } from "express";
import { config } from "dotenv";
import authRouter from "./routers/authRouter.mjs";
import { PrismaClient } from "@prisma/client";
import { errorHandeler } from "./utils/errorHandler.mjs";
import cookieParser from "cookie-parser";
import cors from "cors";
import { verifyToken } from "./middlewares/verifyToken.mjs";
export const prisma = new PrismaClient();
config();

const app = express();
const PORT = process.env.PORT || 5000;

const whitelist = ["http://localhost:3000", "http://example2.com"];
const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(json());
app.use("/auth", authRouter);
app.get("/", verifyToken, (req, res) => {
  res.send({});
});
app.use(errorHandeler);
app.listen(PORT, () => console.log(`Listening on ${PORT} ⚡`));
