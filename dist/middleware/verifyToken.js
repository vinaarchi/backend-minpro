"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
    var _a;
    try {
        console.log("from request header", req.headers);
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        console.log("Received Token", token);
        if (!token) {
            throw { rc: 400, status: false, message: "Token not exist" };
        }
        //verify Token
        const checkToken = (0, jsonwebtoken_1.verify)(token, process.env.TOKEN_KEY || "SECRET");
        console.log("INI DARI VERIFY TOKEN", checkToken);
        res.locals.decript = checkToken;
        next();
    }
    catch (error) {
        console.log(error.message);
        res.status(401).send({
            message: "Unauthorized token, is invalid",
            success: false,
        });
    }
};
exports.verifyToken = verifyToken;
