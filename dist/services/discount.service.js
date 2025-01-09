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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDiscountCouponValid = exports.createDiscountCoupon = void 0;
const prisma_1 = require("../config/prisma");
const generateReferralCode_1 = require("../utils/generateReferralCode");
const createDiscountCoupon = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 3);
    const discountCode = (0, generateReferralCode_1.generateReferralCode)();
    console.log(discountCode);
    yield prisma_1.prisma.discountCoupon.create({
        data: {
            code: discountCode, // kode diskon
            discount: 10, // diskon 10%
            expirationDate: expirationDate, // tanggal kadaluarsa 3 bulan dari sekarang
            userId: userId, // id user yang mendapatkan diskon
        },
    });
});
exports.createDiscountCoupon = createDiscountCoupon;
// cek apakah kode diskon valid
const isDiscountCouponValid = (discountCode, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield prisma_1.prisma.discountCoupon.findUnique({
        where: {
            code: discountCode,
            userId: userId,
        },
    });
    console.log(coupon);
    if (!coupon) {
        return false; // kode diskon tidak ditemukan
    }
    // memeriksa apakah kode diskon milik pengguna yang dimaksud
    if (coupon.userId !== userId) {
        return false; // kupon tidak milik pengguna ini
    }
    const currentDate = new Date();
    if (coupon.expirationDate <= currentDate) {
        return false; // kode diskon sudah kadaluwarsa
    }
    //kalo semua pemeriksaannya valid
    return true;
});
exports.isDiscountCouponValid = isDiscountCouponValid;
