"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationDetailController = void 0;
const prisma_1 = require("../config/prisma");
class LocationDetailController {
    //create a location detail
    addLocationDetail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { country, state, city } = req.body;
            if (!country || !state || !city) {
                return res.status(400).json({ error: "Missing required fields" });
            }
            try {
                const locationDetail = yield prisma_1.prisma.locationDetail.create({
                    data: { country, state, city },
                });
                res.status(201).json(locationDetail);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: "Failed to add location detail" });
            }
        });
    }
    //get a location detail by id
    getLocationDetailById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const locationDetailId = parseInt(req.params.id);
            try {
                const locationDetail = yield prisma_1.prisma.locationDetail.findUnique({
                    where: { id: locationDetailId },
                });
                if (!locationDetail) {
                    return res.status(404).json({ error: "Location detail not found" });
                }
                res.json(locationDetail);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: "Failed to fetch location detail" });
            }
        });
    }
    //get all location details
    getAllLocationDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const locationDetails = yield prisma_1.prisma.locationDetail.findMany();
                res.json(locationDetails);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: "Failed to fetch location details" });
            }
        });
    }
    //update location detail
    updateLocationDetail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const locationDetailId = parseInt(req.params.id);
            const { country, state, city } = req.body;
            try {
                const locationDetail = yield prisma_1.prisma.locationDetail.findUnique({
                    where: { id: locationDetailId },
                });
                if (!locationDetail) {
                    return res.status(404).json({ error: "Location detail not found" });
                }
                const updatedLocationDetail = yield prisma_1.prisma.locationDetail.update({
                    where: { id: locationDetailId },
                    data: Object.assign(Object.assign(Object.assign({}, (country && { country })), (state && { state })), (city && { city })),
                });
                res.json(updatedLocationDetail);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: "Failed to update location detail" });
            }
        });
    }
    //delete location detail
    deleteLocationDetail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const locationDetailId = parseInt(req.params.id);
            try {
                const locationDetail = yield prisma_1.prisma.locationDetail.findUnique({
                    where: { id: locationDetailId },
                });
                if (!locationDetail) {
                    return res.status(404).json({ error: "Location detail not found" });
                }
                yield prisma_1.prisma.locationDetail.delete({
                    where: { id: locationDetailId },
                });
                res.json({ message: "Location detail deleted successfully" });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: "Failed to delete location detail" });
            }
        });
    }
}
exports.LocationDetailController = LocationDetailController;
