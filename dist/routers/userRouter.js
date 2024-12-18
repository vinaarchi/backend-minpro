"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = require("express");
const user_controllers_1 = require("../controllers/user.controllers");
const validator_1 = require("../middleware/validator");
class UserRouter {
    constructor() {
        this.userController = new user_controllers_1.UserController();
        this.route = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.route.post("/sign-up", validator_1.regisValidation, this.userController.register);
        this.route.post("/sign-in", this.userController.signIn);
        this.route.post("/keep-login", this.userController.keepLogin);
        this.route.get("/:id", this.userController.getUserById);
        this.route.patch("/:id", this.userController.updateUser);
        this.route.delete("/:id", this.userController.deleteUser);
    }
    getRouter() {
        return this.route;
    }
}
exports.UserRouter = UserRouter;
