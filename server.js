import express, { json } from "express";
import { config } from "dotenv";
import userRouter from "./routers/userRouter.mjs";
config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(json());
app.use("/user", userRouter);

app.listen(PORT, () => console.log(`Listening on ${PORT} ⚡`));
