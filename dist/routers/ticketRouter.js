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
        this.route.get("/:eventId", this.ticketController.getTicketsForEvent);
        this.route.patch("/:id", this.ticketController.updateTicket);
        this.route.delete("/:id", this.ticketController.deleteTicket);
    }
    getRouter() {
        return this.route;
    }
}
exports.TicketRouter = TicketRouter;
