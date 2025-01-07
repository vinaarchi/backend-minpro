import { Router } from "express";
import { LocationController } from "../controllers/locationController";

export class LocationRouter {
  private route: Router;
  private locationController: LocationController;

  constructor() {
    this.locationController = new LocationController();
    this.route = Router();
    this.initializeRoutes();
  }
  private initializeRoutes(): void {
    this.route.post("/", this.locationController.addLocationDetail);
  }
  public getRouter(): Router {
    return this.route;
  }
}
