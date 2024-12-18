"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const prisma_1 = require("../config/prisma");
const ResponseHandler_1 = __importDefault(require("../utils/ResponseHandler"));
const hashPassword_1 = require("../utils/hashPassword");
const jsonwebtoken_1 = require("jsonwebtoken");
const bcrypt_1 = require("bcrypt");
const generateReferralCode_1 = require("../utils/generateReferralCode");
const point_service_1 = require("../services/point.service");
// import { createDiscountCoupon } from "../services/discount.service";
class UserController {
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //cek apakah email ada atau tidak
                const isExistUser = yield prisma_1.prisma.user.findUnique({
                    where: { email: req.body.email },
                });
                console.log(isExistUser);
                if (isExistUser) {
                    return ResponseHandler_1.default.error(res, `${req.body.email} is already registered. Please use another email.`, 400);
                }
                const newPassword = yield (0, hashPassword_1.hashPassword)(req.body.password);
                //Generate referral code untuk pengguna baru
                const referralCode = (0, generateReferralCode_1.generateReferralCode)();
                // cek apakah ada referral code yang digunakan
                let referredById = null;
                if (req.body.referralCode) {
                    const referralUser = yield prisma_1.prisma.user.findUnique({
                        where: { referralCode: req.body.referralCode },
                    });
                    //klo kode referralnya valid, set jadi referredById
                    if (referralUser) {
                        referredById = referralUser.id;
                        // nambahin point ke user yang punya referal (10.000 poin)
                        yield (0, point_service_1.addReferralPoints)(referralUser.id);
                        // // bikin kupon diskon untuk pengguna baru yang baru daftar pake referral
                        // await createDiscountCoupon(referralUser.id);
                    }
                }
                // buat pengguna baru
                const user = yield prisma_1.prisma.user.create({
                    data: Object.assign(Object.assign({}, req.body), { password: newPassword, referralCode: referralCode, referredById: referredById }),
                });
                const token = (0, jsonwebtoken_1.sign)({ id: user.id, email: user.email }, process.env.TOKEN_KEY || "secret", { expiresIn: "1h" });
                return ResponseHandler_1.default.success(res, "Your signup is success, please check your email", 201, {
                    token,
                    user,
                });
            }
            catch (error) {
                console.log(error);
                return ResponseHandler_1.default.error(res, "Registration failed", error, 500);
            }
        });
    }
    signIn(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findUser = yield prisma_1.prisma.user.findUnique({
                    where: {
                        email: req.body.email,
                    },
                });
                if (!findUser) {
                    throw { rc: 404, message: "Account is not exist" };
                }
                //Checkpassword
                const comparePass = (0, bcrypt_1.compareSync)(req.body.password, findUser.password);
                if (!comparePass) {
                    throw { rc: 401, message: "Password is Wrong" };
                }
                const token = (0, jsonwebtoken_1.sign)({ id: findUser.id, email: findUser.email }, process.env.TOKEN_KEY || "test");
                return res.status(200).send({
                    fullname: findUser.fullname,
                    username: findUser.username,
                    email: findUser.email,
                    token,
                });
            }
            catch (error) {
                console.log(error);
                return ResponseHandler_1.default.error(res, "SignIn failed", error.rc || 500, error);
            }
        });
    }
    keepLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // data dari middleware
                console.log("at keepLogin controller", res.locals.decript);
                const findUser = yield prisma_1.prisma.user.findUnique({
                    where: { id: res.locals.decript.id },
                });
                if (!findUser) {
                    throw { rc: 404, message: "Account is not exist" };
                }
                const token = (0, jsonwebtoken_1.sign)({ id: findUser.id, email: findUser.email }, process.env.TOKEN_KEY || "test");
                return res.status(200).send({
                    fullname: findUser.fullname,
                    username: findUser.username,
                    email: findUser.email,
                    token,
                });
            }
            catch (error) {
                console.log(error);
                return res.status(error.rc || 500).send({
                    message: "Your keepLogin is failed",
                    success: false,
                    error: error.message,
                });
            }
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = parseInt(req.params.id); //dapetin id pengguna dari parameter
                const user = yield prisma_1.prisma.user.findUnique({
                    where: { id: userId },
                });
                if (!user) {
                    return ResponseHandler_1.default.error(res, "User not Found", 404);
                }
                return ResponseHandler_1.default.success(res, "User data fetched successfully", 200, user);
            }
            catch (error) {
                console.log(error);
                return ResponseHandler_1.default.error(res, "Failed to fetch user data", error.rc || 500, error);
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = parseInt(req.params.id);
                const updatedData = req.body;
                const user = yield prisma_1.prisma.user.findUnique({
                    where: { id: userId },
                });
                if (!user) {
                    return ResponseHandler_1.default.error(res, "User not Found", 404);
                }
                //Buat update data pengguna
                const updatedUser = yield prisma_1.prisma.user.update({
                    where: { id: userId },
                    data: updatedData,
                });
                return ResponseHandler_1.default.success(res, "User Updatedd successfully", 200, updatedUser);
            }
            catch (error) {
                console.log(error);
                return ResponseHandler_1.default.error(res, "Failed to update data", error.rc || 500, error);
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = parseInt(req.params.id);
                const user = yield prisma_1.prisma.user.findUnique({
                    where: { id: userId },
                });
                if (!user) {
                    return ResponseHandler_1.default.error(res, "User not Found", 404);
                }
                yield prisma_1.prisma.user.delete({
                    where: { id: userId },
                });
                return ResponseHandler_1.default.success(res, "User deleted successfully", 200);
            }
            catch (error) {
                console.log(error);
                return ResponseHandler_1.default.error(res, "Failed to delete user", error.rc || 500, error);
            }
        });
    }
}
exports.UserController = UserController;
