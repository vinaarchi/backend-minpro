import { Router } from "express";
import { TransactionController } from "../controllers/transaction.controller";
import { verifyToken } from "../middleware/verifyToken";

export class TransactionRouter {
  private route: Router;
  private transactionController: TransactionController;

  constructor() {
    this.route = Router();
    this.transactionController = new TransactionController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.route.get(
      "/organizer/:organizerId/stats",
      this.transactionController.getOrganizerEventStats
    );

    this.route.post("/", this.transactionController.createTransaction);
    this.route.get(
      "/user/:userId",
      this.transactionController.getUserTransactions
    );

    this.route.get(
      "/total-earnings/organizer/:organiserId",
      this.transactionController.getTotalTransaction
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}
