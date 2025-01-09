"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRouter = void 0;
const express_1 = require("express");
const transaction_controller_1 = require("../controllers/transaction.controller");
class TransactionRouter {
    constructor() {
        this.route = (0, express_1.Router)();
        this.transactionController = new transaction_controller_1.TransactionController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.route.get("/organizer/:organizerId/stats", this.transactionController.getOrganizerEventStats);
        this.route.post("/", this.transactionController.createTransaction);
        this.route.get("/user/:userId", this.transactionController.getUserTransactions);
        this.route.get("/total-earnings/organizer/:organiserId", this.transactionController.getTotalTransaction);
    }
    getRouter() {
        return this.route;
    }
}
exports.TransactionRouter = TransactionRouter;
