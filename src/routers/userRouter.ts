import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "../controllers/user.controllers";
import { regisValidation } from "../middleware/validator";

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
    this.route.post("/keep-login", this.userController.keepLogin);

  }

  public getRouter(): Router {
    return this.route;
  }
}
