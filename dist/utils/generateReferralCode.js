"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReferralCode = void 0;
const generateReferralCode = () => {
    return Math.random().toString(36).substring(2, 12).toUpperCase();
};
exports.generateReferralCode = generateReferralCode;
