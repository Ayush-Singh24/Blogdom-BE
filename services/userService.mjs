import { prisma } from "../server.mjs";
import { GeneralError } from "../utils/generalError.mjs";
import * as bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../utils/constants.mjs";

export const createUser = async ({ username, email, password }) => {
  let user = await prisma.user.findFirst({
    where: {
      OR: [
        {
          username,
        },
        {
          email,
        },
      ],
    },
  });

  if (user) {
    throw new GeneralError(409, "Username or Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  return user.username;
};

export const loginUser = async ({ username, password }) => {
  let user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    throw new GeneralError(404, "Username not found");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new GeneralError(401, "Incorrect password");
  }

  return user.username;
};
