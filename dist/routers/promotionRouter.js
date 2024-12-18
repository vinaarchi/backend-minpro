"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionRouter = void 0;
const express_1 = require("express");
const promotion_controller_1 = require("../controllers/promotion.controller");
class PromotionRouter {
    constructor() {
        this.promotionController = new promotion_controller_1.PromotionController();
        this.route = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.route.post("/", this.promotionController.addPromotion);
        this.route.get("/:eventId", this.promotionController.getPromotionsForEvent);
        this.route.patch("/:id", this.promotionController.updatePromotion);
        this.route.delete("/:id", this.promotionController.deletePromotion);
    }
    getRouter() {
        return this.route;
    }
}
exports.PromotionRouter = PromotionRouter;
