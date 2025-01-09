"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationDetailRouter = void 0;
const express_1 = require("express");
const locationDetailController_1 = require("../controllers/locationDetailController");
class LocationDetailRouter {
    constructor() {
        this.locationDetailController = new locationDetailController_1.LocationDetailController();
        this.route = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        // this.route.get("/", this.locationDetailController.getAllLocationDetails);
        // this.route.get("/:id", this.locationDetailController.getLocationDetailById);
        // this.route.post("/", this.locationDetailController.addLocationDetail);
        // this.route.patch(
        //   "/:id",
        //   this.locationDetailController.updateLocationDetail
        // );
        // this.route.delete(
        //   "/:id",
        //   this.locationDetailController.deleteLocationDetail
        // );
        this.route.get("/province", this.locationDetailController.getProvince);
        this.route.get("/cities", this.locationDetailController.getCities);
        this.route.get("/districts/:cityId", this.locationDetailController.getDistricts);
    }
    getRouter() {
        return this.route;
    }
}
exports.LocationDetailRouter = LocationDetailRouter;
