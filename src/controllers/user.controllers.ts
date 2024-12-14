import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import ResponseHandler from "../utils/ResponseHandler";
import { hashPassword } from "../utils/hashPassword";
import { sign } from "jsonwebtoken";
import { sendEmail } from "../utils/emailSender";
import { compareSync } from "bcrypt";
import { generateReferralCode } from "../utils/generateReferralCode";
import { addReferralPoints } from "../services/point.service";
// import { createDiscountCoupon } from "../services/discount.service";

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

      //Generate referral code untuk pengguna baru
      const referralCode = generateReferralCode();

      // cek apakah ada referral code yang digunakan
      let referredById: number | null = null;
      if (req.body.referralCode) {
        const referralUser = await prisma.user.findUnique({
          where: { referralCode: req.body.referralCode },
        });

        //klo kode referralnya valid, set jadi referredById
        if (referralUser) {
          referredById = referralUser.id;

          // nambahin point ke user yang punya referal (10.000 poin)
          await addReferralPoints(referralUser.id);

          // // bikin kupon diskon untuk pengguna baru yang baru daftar pake referral
          // await createDiscountCoupon(referralUser.id);
        }
      }

      // buat pengguna baru
      const user = await prisma.user.create({
        data: {
          ...req.body,
          password: newPassword,
          referralCode: referralCode,
          referredById: referredById,
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

  async keepLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      // data dari middleware
      console.log("at keepLogin controller", res.locals.decript);
      const findUser = await prisma.user.findUnique({
        where: { id: res.locals.decript.id },
      });

      if (!findUser) {
        throw { rc: 404, message: "Account is not exist" };
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
      return res.status(error.rc || 500).send({
        message: "Your keepLogin is failed",
        success: false,
        error: error.message,
      });
    }
  }

  async getUserById(req: Request, res: Response): Promise<any> {
    try {
      const userId = parseInt(req.params.id); //dapetin id pengguna dari parameter
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return ResponseHandler.error(res, "User not Found", 404);
      }

      return ResponseHandler.success(
        res,
        "User data fetched successfully",
        200,
        user
      );
    } catch (error: any) {
      console.log(error);
      return ResponseHandler.error(
        res,
        "Failed to fetch user data",
        error.rc || 500,
        error
      );
    }
  }

  async updateUser(req: Request, res: Response): Promise<any> {
    try {
      const userId = parseInt(req.params.id);
      const updatedData = req.body;

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        return ResponseHandler.error(res, "User not Found", 404);
      }

      //Buat update data pengguna
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updatedData,
      });

      return ResponseHandler.success(
        res,
        "User Updatedd successfully",
        200,
        updatedUser
      );
    } catch (error: any) {
      console.log(error);
      return ResponseHandler.error(
        res,
        "Failed to update data",
        error.rc || 500,
        error
      );
    }
  }

  async deleteUser(req: Request, res: Response): Promise<any> {
    try {
      const userId = parseInt(req.params.id);

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        return ResponseHandler.error(res, "User not Found", 404);
      }

      await prisma.user.delete({
        where: { id: userId },
      });

      return ResponseHandler.success(res, "User deleted successfully", 200);
    } catch (error: any) {
      console.log(error);
      return ResponseHandler.error(
        res,
        "Failed to delete user",
        error.rc || 500,
        error
      );
    }
  }
}
