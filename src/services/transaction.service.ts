import { isDiscountCouponValid } from "./discount.service";

export const applyDiscountCoupon = async (
  userId: number,
  couponCode: string,
  originalAmount: number
): Promise<number> => {
  const isValid = await isDiscountCouponValid(couponCode); // cek apakah kode diskon valid

  if (!isValid) {
    throw new Error("Invalid discount coupon");
  }

  const discountAmount = 10; // diskon 10%
  const discountedAmount = originalAmount * (1 - discountAmount / 100); // hitung jumlah yang harus dibayar

  return discountedAmount;
};
