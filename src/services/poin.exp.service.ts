import { prisma } from "../config/prisma";

export const redeemPointsForDiscount = async (
  userId: number,
  ticketPrice: number
): Promise<any> => {
  //ngambil semua saldo poin penggguna
  const pointBalances = await prisma.pointBalance.findMany({
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
};
