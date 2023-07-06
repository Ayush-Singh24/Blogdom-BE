import express, { json } from "express";
import { config } from "dotenv";
import userRouter from "./routers/userRouter.mjs";
import { PrismaClient } from "@prisma/client";
import { errorHandeler } from "./utils/errorHandler.mjs";
export const prisma = new PrismaClient();
config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(json());
app.use("/user", userRouter);
app.use(errorHandeler);
app.listen(PORT, () => console.log(`Listening on ${PORT} ⚡`));
