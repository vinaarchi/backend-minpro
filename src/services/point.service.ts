import { prisma } from "../config/prisma";


//buat nambahin poin ke user yang punya referral
export const addReferralPoints = async (
  referralUserId: number
): Promise<void> => {
  const expirationDate = new Date();
  expirationDate.setMonth(expirationDate.getMonth() + 3); // poin kadaluarsa dalam 3 bulan saja

  await prisma.pointBalance.create({
    data: {
      points: 10000,
      expirationDate: expirationDate,
      userId: referralUserId,
    },
  });
};
