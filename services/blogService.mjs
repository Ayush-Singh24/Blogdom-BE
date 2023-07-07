import { prisma } from "../server.mjs";
import { GeneralError } from "../utils/generalError.mjs";
import fs from "fs";
import { v4 as uuid } from "uuid";
import { getStorage } from "firebase-admin/storage";

export async function saveBlog({ username, title, blogContent }) {
  const bucket = getStorage().bucket();

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
}