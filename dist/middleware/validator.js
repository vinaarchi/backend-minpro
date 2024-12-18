"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.regisValidation = void 0;
const express_validator_1 = require("express-validator");
const ResponseHandler_1 = __importDefault(require("../utils/ResponseHandler"));
exports.regisValidation = [
    (0, express_validator_1.body)("username").notEmpty(),
    (0, express_validator_1.body)("fullname").notEmpty(),
    (0, express_validator_1.body)("email").isEmail().withMessage("Email is Required"),
    (0, express_validator_1.body)("password").notEmpty().isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 0,
        minUppercase: 0,
    }),
    (req, res, next) => {
        const errorValidation = (0, express_validator_1.validationResult)(req);
        if (!errorValidation.isEmpty()) {
            // jika ada error maka akan dikirim response
            return ResponseHandler_1.default.error(res, "Your Data is invalid", errorValidation, 400);
        }
        next();
    },
];
