import { prisma } from "../server.mjs";
import { GeneralError } from "../utils/generalError.mjs";
import fs, { createReadStream } from "fs";
import { v4 as uuid } from "uuid";
import { getStorage } from "firebase-admin/storage";
import { bucket } from "../server.mjs";
import { __dirname } from "../dir.mjs";

export async function saveBlog({ username, title, blogContent }) {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    throw new GeneralError(401, "Not authorized");
  }

  const fileId = uuid() + ".txt";

  await bucket.file(fileId).save(blogContent);

  const blog = await prisma.blog.create({
    data: {
      fileId,
      title,
      authorName: user.username,
    },
  });

  if (!blog) {
    throw new GeneralError(500, "Blog Could not be saved");
  }
}

export async function getBlog({ fileId }) {
  const blog = await prisma.blog.findUnique({
    where: {
      fileId,
    },
  });

  if (!blog) {
    throw new GeneralError(404, "Blog not found");
  }

  const file = await bucket.file(fileId).download({ destination: fileId });
  // const file = bucket.file(fileId).createReadStream();
  // .pipe(fs.createWriteStream(fileId));
  const blogContent = fs.readFileSync(fileId);
  // const readBlogStream = createReadStream(fileId);
  // return {
  //   readBlogStream,
  //   title: blog.title,
  //   authorName: blog.authorName,
  // };

  setTimeout(() => {
    fs.unlink(__dirname + `/${fileId}`, () => {
      console.log("File deleted");
    });
    // console.log("../" + __dirname + "/" + fileId);
  }, 5 * 1000);

  return {
    blogContent: blogContent.toString(),
    title: blog.title,
    authorName: blog.authorName,
  };
}

export async function getAllBlogs() {
  const allBlogs = await prisma.blog.findMany();

  if (!allBlogs) {
    throw new GeneralError(404, "Not found");
  }

  return allBlogs;
}
