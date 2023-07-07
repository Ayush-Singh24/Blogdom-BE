import express from "express";
import { verifyToken } from "../middlewares/verifyToken.mjs";
import { getBlog, saveBlog } from "../services/blogService.mjs";
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

blogRouter.get("/:fileId", async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const blogData = await getBlog({ fileId });
    res.status(200).send(blogData);
  } catch (error) {
    next(error);
  }
});
