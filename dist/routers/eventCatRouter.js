"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventCategoryRouter = void 0;
const express_1 = require("express");
const eventCatController_1 = require("../controllers/eventCatController");
class EventCategoryRouter {
    constructor() {
        this.eventCategoryController = new eventCatController_1.EventCategoryController();
        this.route = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.route.get("/", (req, res) => this.eventCategoryController.getAllCategories(req, res));
        this.route.get("/topics", (req, res) => this.eventCategoryController.getAllTopics(req, res));
        this.route.post("/", (req, res) => this.eventCategoryController.createCategory(req, res));
        this.route.patch("/:id", (req, res) => this.eventCategoryController.updateCategory(req, res));
        this.route.delete("/:id", (req, res) => this.eventCategoryController.deleteCategory(req, res));
        this.route.get("/formats", (req, res) => this.eventCategoryController.getAllFormats(req, res));
    }
    getRouter() {
        return this.route;
    }
}
exports.EventCategoryRouter = EventCategoryRouter;
