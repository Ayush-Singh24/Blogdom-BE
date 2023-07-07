import express from "express";
import { verifyToken } from "../middlewares/verifyToken.mjs";
import { saveBlog } from "../services/blogService.mjs";
export const blogRouter = express.Router();

blogRouter.use(verifyToken);

blogRouter.post("/saveblog", async (req, res, next) => {
  try {
    const { title, blogContent } = req.body;
    const { username } = req.user;
    await saveBlog({ username, blogContent, title });
    res.status(201).send({ messsage: "Succefully uploaded" });
  } catch (error) {
    next(error);
  }
});
