import { Router } from "express";
import { EventCategoryController } from "../controllers/eventCatController";

export class EventCategoryRouter {
  private route: Router;
  private eventCategoryController: EventCategoryController;

  constructor() {
    this.eventCategoryController = new EventCategoryController();
    this.route = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.route.get("/", (req, res) =>
      this.eventCategoryController.getAllCategories(req, res)
    );
    this.route.get("/topics", (req, res) =>
      this.eventCategoryController.getAllTopics(req, res)
    );
    this.route.post("/", (req, res) =>
      this.eventCategoryController.createCategory(req, res)
    );
    this.route.patch("/:id", (req, res) =>
      this.eventCategoryController.updateCategory(req, res)
    );
    this.route.delete("/:id", (req, res) =>
      this.eventCategoryController.deleteCategory(req, res)
    );
    this.route.get("/formats", (req, res) =>
      this.eventCategoryController.getAllFormats(req, res)
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}
