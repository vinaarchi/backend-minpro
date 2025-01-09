"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRouter = void 0;
const express_1 = require("express");
const event_controller_1 = require("../controllers/event.controller");
class EventRouter {
    constructor() {
        this.eventController = new event_controller_1.EventsController();
        this.route = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.route.get("/", this.eventController.getEvents);
        this.route.get("/:id", this.eventController.getEventDetails);
        this.route.get("/:eventId/promotions", this.eventController.getPromotionsForEvent);
        this.route.post("/", this.eventController.createEvent);
        this.route.patch("/:id", this.eventController.updateEvent);
        this.route.get("/:eventId/tickets", this.eventController.getTicketsByEvent);
        this.route.post("/upload", this.eventController.uploadImage);
        this.route.get("/:id/reviews", this.eventController.getEventReviews);
        this.route.post("/:id/reviews", this.eventController.addReview);
        this.route.get("/total-events/:id", this.eventController.getTotalEvent);
    }
    getRouter() {
        return this.route;
    }
}
exports.EventRouter = EventRouter;
