export const generateReferralCode = () => {
  return Math.random().toString(36).substring(2, 12).toUpperCase;
};
