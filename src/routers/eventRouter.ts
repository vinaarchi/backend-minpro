import { Router, Request, Response, NextFunction } from "express";
import express from "express";
import { EventsController } from "../controllers/event.controller";
import { verifyToken } from "../middleware/verifyToken";

export class EventRouter {
  private route: Router;
  private eventController: EventsController;

  constructor() {
    this.eventController = new EventsController();
    this.route = Router();
    this.initializeRoutes();
  }
  private initializeRoutes(): void {
    this.route.get("/", this.eventController.getEvents);
    this.route.get("/:id", this.eventController.getEventDetails);
    this.route.post("/", this.eventController.createEvent);
    this.route.patch("/:id", this.eventController.updateEvent);
    this.route.get("/:eventId/tickets", this.eventController.getTicketsByEvent);
    this.route.post("/upload", this.eventController.uploadImage);

    this.route.get("/:id/reviews", this.eventController.getEventReviews);
    this.route.post("/:id/reviews", this.eventController.addReview);
    this.route.get("/total-events/:id", this.eventController.getTotalEvent);
  }

  public getRouter(): Router {
    return this.route;
  }
}
