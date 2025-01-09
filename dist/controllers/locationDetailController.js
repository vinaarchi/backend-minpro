"use strict";
// import { Request, Response } from "express";
// import { prisma } from "../config/prisma";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationDetailController = void 0;
const axios_1 = __importDefault(require("axios"));
class LocationDetailController {
    getProvince(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json");
                const javaEast = response.data.find((p) => p.id === "35");
                res.json(javaEast);
            }
            catch (error) {
                res.status(500).json({ error: "Failed to fetch province data" });
            }
        });
    }
    getCities(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get("https://www.emsifa.com/api-wilayah-indonesia/api/regencies/35.json");
                const filteredCities = response.data.filter((city) => parseInt(city.id) >= 3571 && parseInt(city.id) <= 3579);
                res.json(filteredCities);
            }
            catch (error) {
                res.status(500).json({ error: "Failed to fetch cities data" });
            }
        });
    }
    getDistricts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { cityId } = req.params;
            try {
                const response = yield axios_1.default.get(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${cityId}.json`);
                res.json(response.data);
            }
            catch (error) {
                res.status(500).json({ error: "Failed to fetch districts data" });
            }
        });
    }
}
exports.LocationDetailController = LocationDetailController;
