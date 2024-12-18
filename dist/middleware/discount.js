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
exports.applyDiscountCoupon = void 0;
const prisma_1 = require("../config/prisma");
const ResponseHandler_1 = __importDefault(require("../utils/ResponseHandler"));
const applyDiscountCoupon = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // ngecek apakah kupon discountnya masih berlaku atau ga
    const { userId, ticketPrice } = req.body;
    const discountCoupon = yield prisma_1.prisma.discountCoupon.findFirst({
        where: { userId: userId, expirationDate: { gte: new Date() } },
    });
    if (!discountCoupon) {
        return ResponseHandler_1.default.error(res, "Discount Coupon is not Valid", null, 400);
    }
    // ngitung harga setelah di diskon
    const discount = (ticketPrice * discountCoupon.discount) / 100;
    const finalPrice = ticketPrice - discount;
    // nyimpen harga final untuk digunakan di route handle selanjutnya
    req.body.finalPrice = finalPrice;
    next();
});
exports.applyDiscountCoupon = applyDiscountCoupon;
