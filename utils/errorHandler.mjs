import { GeneralError } from "./generalError.mjs";

export const errorHandeler = (err, req, res, next) => {
  if (err instanceof GeneralError) {
    res.status(err.status).send({ message: err.message });
  } else {
    res.status(500).send({ message: "Server Error" });
  }
};
