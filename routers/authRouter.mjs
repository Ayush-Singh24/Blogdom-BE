import express from "express";
import { createUser, loginUser } from "../services/authService.mjs";
import jwt from "jsonwebtoken";
import { loginSchema, signUpSchema } from "../utils/zodSchemas.mjs";
const authRouter = express.Router();

authRouter.post("/signup", async (req, res, next) => {
  try {
    const { username, email, password } = signUpSchema.parse(req.body);
    await createUser({ username, email, password });
    res.status(201).send({ message: "User successfully signed-up" });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const { username, password } = loginSchema.parse(req.body);
    const name = await loginUser({ username, password });
    const token = jwt.sign({ username: name }, process.env.PRIVATE_KEY, {
      expiresIn: "5d",
    });
    res
      .cookie("token", token, { httpOnly: true, maxAge: 5 * 24 * 3600 * 1000 })
      .status(200)
      .send({ message: "Logged in" });
  } catch (error) {
    next(error);
  }
});

export default authRouter;
