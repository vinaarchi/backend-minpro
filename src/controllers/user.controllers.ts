import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import ResponseHandler from "../utils/ResponseHandler";
import { hashPassword } from "../utils/hashPassword";
import { sign } from "jsonwebtoken";
import { sendEmail } from "../utils/emailSender";
import { compareSync } from "bcrypt";
import { generateReferralCode } from "../utils/generateReferralCode";

export class UserController {
  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      //cek apakah email ada atau tidak
      const isExistUser = await prisma.user.findUnique({
        where: { email: req.body.email },
      });
      console.log(isExistUser);

      if (isExistUser) {
        return ResponseHandler.error(
          res,
          `${req.body.email} is already registered. Please use another email.`,
          400
        );
      }

      const newPassword = await hashPassword(req.body.password);

      //validasi referral code (jika ada)
      let referredById = null;
      if (req.body.referredByCode) {
        const referredByUser = await prisma.user.findUnique({
          where: { referralCode: req.body.referredByCode },
        });

        if (referredByUser) {
          referredById = referredByUser.id;

          //nambahin poin ke user yang ngasih code
          await prisma.user.update({
            where: { id: referredById },
            data: {
              pointsBalance: {
                increment: 10000,
              },
            },
          });
        } else {
          return ResponseHandler.error(
            res,
            "Invalid referral code. Please check and try again.",
            400
          );
        }
      }

      //Generate referral code untuk pengguna baru
      const referralCode = generateReferralCode();

      // buat pengguna baru
      const user = await prisma.user.create({
        data: {
          ...req.body,
          password: newPassword,
          referredById: referredById,
          referralCode: referralCode,
        },
      });

      const token = sign(
        { id: user.id, email: user.email },
        process.env.TOKEN_KEY || "secret",
        { expiresIn: "1h" }
      );

      return ResponseHandler.success(res, "Your signup is success", 201, {
        token,
        user,
      });
    } catch (error: any) {
      console.log(error);
      return ResponseHandler.error(
        res,
        "Registration failed",
        error.rc || 500,
        error
      );
    }
  }

  async signIn(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const findUser = await prisma.user.findUnique({
        where: {
          email: req.body.email,
        },
      });

      if (!findUser) {
        throw { rc: 404, message: "Account is not exist" };
      }

      //Checkpassword
      const comparePass = compareSync(req.body.password, findUser.password);
      if (!comparePass) {
        throw { rc: 401, message: "Password is Wrong" };
      }

      const token = sign(
        { id: findUser.id, email: findUser.email },
        process.env.TOKEN_KEY || "test"
      );

      return res.status(200).send({
        fullname: findUser.fullname,
        username: findUser.username,
        email: findUser.email,
        token,
      });
    } catch (error: any) {
      console.log(error);
      return ResponseHandler.error(
        res,
        "SignIn failed",
        error.rc || 500,
        error
      );
    }
  }
}
