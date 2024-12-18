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
exports.redeemPointsForDiscount = void 0;
const prisma_1 = require("../config/prisma");
const redeemPointsForDiscount = (userId, ticketPrice) => __awaiter(void 0, void 0, void 0, function* () {
    //ngambil semua saldo poin penggguna
    const pointBalances = yield prisma_1.prisma.pointBalance.findMany({
        where: { userId: userId },
    });
    //hitung total poin yang valid
    let totalPoint = 0;
    pointBalances.forEach((point) => {
        if (point.expirationDate && point.expirationDate > new Date()) {
            totalPoint += point.points;
        }
    });
    //hitung diskon berdasarkan poin yang tersedia
    const discount = Math.min(totalPoint, ticketPrice * 0.1);
    const finalPrice = ticketPrice - discount;
    return finalPrice;
});
exports.redeemPointsForDiscount = redeemPointsForDiscount;
