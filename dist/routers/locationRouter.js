"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationRouter = void 0;
const express_1 = require("express");
const locationController_1 = require("../controllers/locationController");
class LocationRouter {
    constructor() {
        this.locationController = new locationController_1.LocationController();
        this.route = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.route.post("/", this.locationController.addLocationDetail);
    }
    getRouter() {
        return this.route;
    }
}
exports.LocationRouter = LocationRouter;
