import express from "express";
import { verifyToken } from "../middlewares/verifyToken.mjs";
import { getAllBlogs, getBlog, saveBlog } from "../services/blogService.mjs";
export const blogRouter = express.Router();

blogRouter.use(verifyToken);

blogRouter.post("/saveblog", async (req, res, next) => {
  try {
    const { title, blogContent } = req.body;
    const { username } = req.user;
    await saveBlog({ username, blogContent, title });
    res.status(201).send({ message: "Succefully uploaded" });
  } catch (error) {
    next(error);
  }
});

blogRouter.get("/all", async (req, res, next) => {
  try {
    const allBlogs = await getAllBlogs();
    res.status(200).send({ allBlogs });
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

// blogRouter.get("/:fileId", async (req, res, next) => {
//   try {
//     const { fileId } = req.params;
//     const { readBlogStream } = await getBlog({ fileId });
//     readBlogStream.pipe(res);
//   } catch (error) {
//     next(error);
//   }
// });
