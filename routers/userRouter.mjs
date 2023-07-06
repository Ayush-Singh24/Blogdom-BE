import express from "express";
import { createUser, loginUser } from "../services/userService.mjs";
import { GeneralError } from "../utils/generalError.mjs";

const userRouter = express.Router();

userRouter.post("/signup", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    await createUser({ username, email, password });
    res.status(201).send({ message: "User successfully signed-up" });
  } catch (error) {
    next(error);
  }
});

userRouter.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    await loginUser({ username, password });
    res.status(200).send({ message: "Logged in" });
  } catch (error) {
    next(error);
  }
});

export default userRouter;
