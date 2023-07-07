import jwt from "jsonwebtoken";
import { prisma } from "../server.mjs";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    const user = await prisma.user.findUnique({
      where: {
        username: decoded.username,
      },
    });
    if (!user) {
      throw new Error("Not authorized");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ message: error.message });
  }
};
