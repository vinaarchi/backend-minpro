import { prisma } from "../config/prisma";
import { generateReferralCode } from "../utils/generateReferralCode";

export const createDiscountCoupon = async (userId: number): Promise<void> => {
  const expirationDate = new Date();
  expirationDate.setMonth(expirationDate.getMonth() + 3);

  const discountCode = generateReferralCode();
  console.log(discountCode);

  await prisma.discountCoupon.create({
    data: {
      code: discountCode, // kode diskon
      discount: 10, // diskon 10%
      expirationDate: expirationDate, // tanggal kadaluarsa 3 bulan dari sekarang
      userId: userId, // id user yang mendapatkan diskon
    },
  });
};

// cek apakah kode diskon valid
export const isDiscountCouponValid = async (
  discountCode: string,
  userId: number
): Promise<boolean> => {
  const coupon = await prisma.discountCoupon.findUnique({
    where: {
      code: discountCode,
      userId: userId,
    },
  });
   console.log(coupon)
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
};
