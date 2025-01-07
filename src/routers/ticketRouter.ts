import { Router } from "express";
import { TicketController } from "../controllers/ticket.controller";

export class TicketRouter {
  private route: Router;
  private ticketController: TicketController;

  constructor() {
    this.ticketController = new TicketController();
    this.route = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.route.post("/", this.ticketController.addTicket);
    // this.route.get("/:eventId", this.ticketController.getTicketsForEvent);
    this.route.patch("/:id", this.ticketController.updateTicket);
    this.route.delete("/:id", this.ticketController.deleteTicket);
    this.route.post("/purchase", this.ticketController.purchaseTicket);
    this.route.get("/:id", this.ticketController.getTicket);
    this.route.get(
      "/total-ticket/organizer/:id",
      this.ticketController.getTotalTicket
    );
    this.route.get(
      "/total-customer/all-event/:id",
      this.ticketController.getTotalCustomer
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}
