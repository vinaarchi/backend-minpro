export const generateReferralCode = (): string => {
  return Math.random().toString(36).substring(2, 12).toUpperCase();
};
