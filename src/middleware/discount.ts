import { prisma } from "../config/prisma";
import { Request, Response, NextFunction } from "express";
import ResponseHandler from "../utils/ResponseHandler";

export const applyDiscountCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
    
  // ngecek apakah kupon discountnya masih berlaku atau ga
  const { userId, ticketPrice } = req.body;
  const discountCoupon = await prisma.discountCoupon.findFirst({
    where: { userId: userId, expirationDate: { gte: new Date() } },
  });

  if (!discountCoupon) {
    return ResponseHandler.error(
      res,
      "Discount Coupon is not Valid",
      null,
      400
    );
  }

  // ngitung harga setelah di diskon
  const discount = (ticketPrice * discountCoupon.discount) / 100;
  const finalPrice = ticketPrice - discount;

  // nyimpen harga final untuk digunakan di route handle selanjutnya
  req.body.finalPrice = finalPrice;

  next();
};
