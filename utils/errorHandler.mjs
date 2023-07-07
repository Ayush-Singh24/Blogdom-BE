import { ZodError } from "zod";
import { GeneralError } from "./generalError.mjs";

export const errorHandeler = (err, req, res, next) => {
  if (err instanceof GeneralError) {
    res.status(err.status).send({ message: err.message });
  } else if (err instanceof ZodError) {
    res.status(400).send({ message: err.issues[0].message });
  } else {
    console.log(err);
    res.status(500).send({ message: "Server Error" });
  }
};
