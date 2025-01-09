"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = require("express");
const user_controllers_1 = require("../controllers/user.controllers");
const validator_1 = require("../middleware/validator");
const verifyToken_1 = require("../middleware/verifyToken");
const uploader_1 = require("../middleware/uploader");
class UserRouter {
    constructor() {
        this.userController = new user_controllers_1.UserController();
        this.route = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.route.post("/sign-up", validator_1.regisValidation, this.userController.register);
        this.route.post("/sign-in", this.userController.signIn);
        this.route.get("/keep-login", verifyToken_1.verifyToken, this.userController.keepLogin);
        this.route.patch("/verify-account", verifyToken_1.verifyToken, this.userController.verifyUser);
        this.route.get("/data-user/:id", this.userController.getUserById);
        this.route.patch("/update/:id", verifyToken_1.verifyToken, this.userController.updateProfile);
        this.route.delete("/delete/:id", this.userController.deleteUser);
        this.route.patch("/photo-profile", verifyToken_1.verifyToken, (0, uploader_1.uploaderMemory)().single("imgProfile"), this.userController.updatePhotoProfile);
        this.route.post("/forgot-password", this.userController.forgotPassword);
        this.route.patch("/reset-password", verifyToken_1.verifyToken, this.userController.resetPassword);
        this.route.get("/:userId/discount-coupon", this.userController.getUserDiscountCoupons);
    }
    getRouter() {
        return this.route;
    }
}
exports.UserRouter = UserRouter;
