"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRouter = void 0;
const express_1 = require("express");
const review_controller_1 = require("../controllers/review.controller");
class ReviewRouter {
    constructor() {
        this.reviewController = new review_controller_1.ReviewController();
        this.route = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.route.get("/:eventId", this.reviewController.getEventReviews);
        this.route.post("/", this.reviewController.addReview);
        this.route.patch("/:id", this.reviewController.updateReview);
        this.route.delete("/:id", this.reviewController.deleteReview);
    }
    getRouter() {
        return this.route;
    }
}
exports.ReviewRouter = ReviewRouter;
