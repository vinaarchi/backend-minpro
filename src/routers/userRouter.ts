import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "../controllers/user.controllers";
import { regisValidation } from "../middleware/validator";
import { verifyToken } from "../middleware/verifyToken";
import { uploaderMemory } from "../middleware/uploader";

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
    this.route.get("/keep-login", verifyToken, this.userController.keepLogin);
    this.route.patch(
      "/verify-account",
      verifyToken,
      this.userController.verifyUser
    );
    this.route.get("/:id", this.userController.getUserById);
    this.route.patch("/:id", this.userController.updateProfile);
    this.route.delete("/:id", this.userController.deleteUser);

    this.route.patch(
      "/photo-profile",
      verifyToken,
      uploaderMemory().single("imgProfile"),
      this.userController.updatePhotoProfile
    );

    this.route.post("/forgot-password", this.userController.forgotPassword);
    this.route.patch(
      "/reset-password",
      verifyToken,
      this.userController.resetPassword
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}
