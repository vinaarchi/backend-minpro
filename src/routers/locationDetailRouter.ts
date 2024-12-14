import { Router } from "express";
import { LocationDetailController } from "../controllers/locationDetailController";

export class LocationDetailRouter {
  private route: Router;
  private locationDetailController: LocationDetailController;

  constructor() {
    this.locationDetailController = new LocationDetailController();
    this.route = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.route.get("/", this.locationDetailController.getAllLocationDetails);
    this.route.get("/:id", this.locationDetailController.getLocationDetailById);
    this.route.post("/", this.locationDetailController.addLocationDetail);
    this.route.patch(
      "/:id",
      this.locationDetailController.updateLocationDetail
    );
    this.route.delete(
      "/:id",
      this.locationDetailController.deleteLocationDetail
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}
