import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "../controllers/user.controllers";
import { regisValidation } from "../middleware/validator";
import { verifyToken } from "../middleware/verifyToken";

export class UserRouter {
  private route: Router;
  private userController: UserController;

  constructor() {
    this.userController = new UserController();
    this.route = Router();
    this.initializeRoutes();
  }
  private initializeRoutes(): void {
    this.route.post("/sign-up", regisValidation, this.userController.register);
    this.route.post("/sign-in", this.userController.signIn);
    this.route.get("/keep-login", this.userController.keepLogin);
    this.route.patch("/:id/switch-role", this.userController.switchRole)
    this.route.patch("/verify", verifyToken, this.userController.verifyUser);
    this.route.get("/:id", this.userController.getUserById);
    this.route.patch("/:id", this.userController.updateUser);
    this.route.delete("/:id", this.userController.deleteUser);

    this.route.post("/forgot-password", this.userController.forgotPassword)
    this.route.patch("/reset-password", verifyToken, this.userController.resetPassword)
  }

  public getRouter(): Router {
    return this.route;
  }
}
