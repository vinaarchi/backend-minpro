import { prisma } from "../config/prisma";
import { generateReferralCode } from "../utils/generateReferralCode";

export const createDiscountCoupon = async (userId: number): Promise<void> => {
  const expirationDate = new Date();
  expirationDate.setMonth(expirationDate.getMonth() + 3);

  const discountCode = generateReferralCode();

  await prisma.discountCoupon.create({
    data: {
      code: discountCode,
      discount: 10,
      expirationDate: expirationDate,
      userId: userId,
    },
  });
};
