// import { Router, Request, Response, NextFunction } from "express";
// import express from "express";
// import { EventsController } from "../controllers/event.controller";
// import { verifyToken } from "../middleware/verifyToken";

// export class EventRouter {
//   private route: Router;
//   private eventController: EventsController;

//   constructor() {
//     this.eventController = new EventsController();
//     this.route = Router();
//     this.initializeRoutes();
//   }
//   private initializeRoutes(): void {
//     this.route.get("/", this.eventController.getEvents);
//     this.route.get("/:id", this.eventController.getEventDetails);
//     this.route.post("/", verifyToken, this.eventController.createEvent);
//     this.route.patch("/:id", this.eventController.updateEvent);
//     this.route.delete("/:id", this.eventController.deleteEvent);
//     this.route.get("/:eventId/tickets", this.eventController.getTicketsByEvent);
//   }

//   public getRouter(): Router {
//     return this.route;
//   }
// }
