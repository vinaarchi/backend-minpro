import { NextFunction, Request, response, Response } from "express";
import { prisma } from "../config/prisma";
import ResponseHandler from "../utils/ResponseHandler";
import { hashPassword } from "../utils/hashPassword";
import { sign } from "jsonwebtoken";
import { sendEmail } from "../utils/emailSender";
import { compareSync } from "bcrypt";
import { generateReferralCode } from "../utils/generateReferralCode";
import { addReferralPoints } from "../services/point.service";
import { transporter } from "../config/nodemailer";
import { register } from "node:module";
import { cloudinaryUpload } from "../config/cloudinary";
import { profile } from "node:console";
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

      await sendEmail(req.body.email, "Registration Info", "register.hbs", {
        username: req.body.username,
        link: `${process.env.FE_URL}/verify?a_t=${token}`,
      });

      return ResponseHandler.success(
        res,
        "Your signup is success, please check your email",
        201,
        {
          token,
          user,
        }
      );
    } catch (error: any) {
      console.log(error);
      return ResponseHandler.error(res, "Registration failed", error, 500);
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
        return ResponseHandler.error(res, "Account is not exist", 404);
      }

      //Checkpassword
      const comparePass = compareSync(req.body.password, findUser.password);
      if (!comparePass) {
        return ResponseHandler.error(res, "Password is incorrect", 400);
      }

      const token = sign(
        { id: findUser.id, email: findUser.email },
        process.env.TOKEN_KEY || "test",
        { expiresIn: "1h" }
      );

      return res.status(200).send({
        id: findUser.id,
        fullname: findUser.fullname,
        username: findUser.username,
        email: findUser.email,
        role: findUser.role,
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

  async keepLogin(req: Request, res: Response): Promise<any> {
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
        process.env.TOKEN_KEY || "test",
        { expiresIn: "1h" }
      );

      return res.status(200).send({
        id: findUser.id,
        fullname: findUser.fullname,
        username: findUser.username,
        email: findUser.email,
        role: findUser.role,
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

  async updateProfile(req: Request, res: Response): Promise<any> {
    try {
      //Buat update data pengguna
      const updateProfile = await prisma.user.update({
        where: { id: res.locals.decript.id },
        data: req.body,
      });

      const token = sign(
        {
          id: updateProfile.id,
          email: updateProfile.email,
        },
        process.env.TOKEN_KEY || "test",
        { expiresIn: "1h" }
      );

      return res.status(200).send({
        id: updateProfile.id,
        fullname: updateProfile.fullname,
        username: updateProfile.username,
        email: updateProfile.email,
        phone: updateProfile.phone,
        gender: updateProfile.gender,
        role: updateProfile.role,

        imgProfile: updateProfile.imgProfile,

        token,
      });
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

  async verifyUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      await prisma.user.update({
        where: { id: parseInt(res.locals.decript.id) },
        data: { isVerified: true },
      });
      ResponseHandler.success(res, "Your Account is verified", 201);
    } catch (error: any) {
      next(error);
    }
  }

  async updatePhotoProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      if (!req.file) {
        throw { rc: 400, message: "File is not Uploaded" };
      }

      const { secure_url } = await cloudinaryUpload(req.file);
      console.log("RESULT FROM MEMORY", secure_url);

      const update = await prisma.user.update({
        where: { id: parseInt(res.locals.decript.id) },
        data: { imgProfile: `/profile/${req.file?.filename}` },
      });
      ResponseHandler.success(
        res,
        "Your Profile Picture has been updated",
        201
      );
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { email } = req.body;

      //ini cari user berdasarkan emailnya
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        throw { rc: 404, message: "Email is not exist" };
      }

      const resetToken = sign(
        { userId: user.id },
        process.env.TOKEN_KEY || "test",
        { expiresIn: "30m" }
      );

      await sendEmail(req.body.email, "Forgot Password", "forgot.hbs", {
        username: req.body.username,
        link: `${process.env.FE_URL}/reset-password?a_t=${resetToken}`,
      });

      return ResponseHandler.success(
        res,
        "Check Your Email To Reset Password",
        201
      );
    } catch (error) {
      return res.status(500).send({
        message: "Check your email to Reset Passwowrd is failed",
      });
    }
  }

  async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const newPassword = await hashPassword(req.body.newPassword);
      const userId = parseInt(res.locals.decript.userId);
      console.log("INI DARI BE RESETPASSWORD", { newPassword, userId });

      await prisma.user.update({
        where: { id: userId },
        data: { password: newPassword },
      });

      return ResponseHandler.success(
        res,
        "Your New Password has been Successfully Updated",
        201
      );
    } catch (error: any) {
      console.log(error);
      return ResponseHandler.error(res, "Reset Password Failed", 500, error);
    }
  }
}
