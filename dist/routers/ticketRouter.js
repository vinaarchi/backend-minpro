"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketRouter = void 0;
const express_1 = require("express");
const ticket_controller_1 = require("../controllers/ticket.controller");
class TicketRouter {
    constructor() {
        this.ticketController = new ticket_controller_1.TicketController();
        this.route = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.route.post("/", this.ticketController.addTicket);
        // this.route.get("/:eventId", this.ticketController.getTicketsForEvent);
        this.route.patch("/:id", this.ticketController.updateTicket);
        this.route.delete("/:id", this.ticketController.deleteTicket);
        this.route.post("/purchase", this.ticketController.purchaseTicket);
        this.route.get("/:id", this.ticketController.getTicket);
        this.route.get("/total-ticket/organizer/:id", this.ticketController.getTotalTicket);
        this.route.get("/total-customer/all-event/:id", this.ticketController.getTotalCustomer);
    }
    getRouter() {
        return this.route;
    }
}
exports.TicketRouter = TicketRouter;
