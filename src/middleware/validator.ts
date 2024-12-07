import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import ResponseHandler from "../utils/ResponseHandler";

export const regisValidation = [
  body("username").notEmpty(),
  body("fullname").notEmpty(),
  body("email").isEmail().withMessage("Email is Required"),
  body("password").notEmpty().isStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 0,
    minUppercase: 0,
  }),
  (req: Request, res: Response, next: NextFunction): any => {
    const errorValidation: any = validationResult(req);
    if (!errorValidation.isEmpty()) {
      // jika ada error maka akan dikirim response
      return ResponseHandler.error(
        res,
        "Your Data is invalid",
        errorValidation,
        400
      );
    }
    next();
  },
];
