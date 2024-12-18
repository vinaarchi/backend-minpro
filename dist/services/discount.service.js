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
exports.createDiscountCoupon = void 0;
const prisma_1 = require("../config/prisma");
const generateReferralCode_1 = require("../utils/generateReferralCode");
const createDiscountCoupon = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 3);
    const discountCode = (0, generateReferralCode_1.generateReferralCode)();
    console.log(discountCode);
    yield prisma_1.prisma.discountCoupon.create({
        data: {
            code: "discountCode",
            discount: 10,
            expirationDate: expirationDate,
            userId: userId,
        },
    });
});
exports.createDiscountCoupon = createDiscountCoupon;
