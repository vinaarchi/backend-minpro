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
exports.PromotionController = void 0;
const prisma_1 = require("../config/prisma");
class PromotionController {
    //create promotion
    addPromotion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { eventId, type, value, promotionCode, startDate, expirationDate, maxUse, } = req.body;
            if (!eventId ||
                !type ||
                !value ||
                !promotionCode ||
                !startDate ||
                !expirationDate ||
                maxUse === undefined) {
                return res.status(400).json({ error: "Missing required fields" });
            }
            try {
                const event = yield prisma_1.prisma.event.findUnique({
                    where: { event_id: eventId },
                });
                if (!event) {
                    return res.status(404).json({ error: "Event not found" });
                }
                const promotion = yield prisma_1.prisma.promotion.create({
                    data: {
                        eventId,
                        type,
                        value,
                        promotionCode,
                        startDate: new Date(startDate),
                        expirationDate: new Date(expirationDate),
                        maxUse,
                    },
                });
                res.status(201).json(promotion);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: "Failed to create promotion" });
            }
        });
    }
    //get promotions for event
    getPromotionsForEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const eventId = parseInt(req.params.eventId);
            try {
                const event = yield prisma_1.prisma.event.findUnique({
                    where: { event_id: eventId },
                });
                if (!event) {
                    return res.status(404).json({ error: "Event not found" });
                }
                const promotions = yield prisma_1.prisma.promotion.findMany({
                    where: { eventId },
                });
                res.json(promotions);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: "Failed to fetch promotions" });
            }
        });
    }
    //update promotion
    updatePromotion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const promotionId = parseInt(req.params.id);
            const { type, value, promotionCode, startDate, expirationDate, maxUse, useCount, } = req.body;
            try {
                const promotion = yield prisma_1.prisma.promotion.findUnique({
                    where: { promotion_id: promotionId },
                });
                if (!promotion) {
                    return res.status(404).json({ error: "Promotion not found" });
                }
                const updatedPromotion = yield prisma_1.prisma.promotion.update({
                    where: { promotion_id: promotionId },
                    data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (type !== undefined && { type })), (value !== undefined && { value })), (promotionCode !== undefined && { promotionCode })), (startDate !== undefined && { startDate: new Date(startDate) })), (expirationDate !== undefined && {
                        expirationDate: new Date(expirationDate),
                    })), (maxUse !== undefined && { maxUse })), (useCount !== undefined && { useCount })),
                });
                res.json(updatedPromotion);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: "Failed to update promotion" });
            }
        });
    }
    //delete promotion
    deletePromotion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const promotionId = parseInt(req.params.id);
            try {
                const promotion = yield prisma_1.prisma.promotion.findUnique({
                    where: { promotion_id: promotionId },
                });
                if (!promotion) {
                    return res.status(404).json({ error: "Promotion not found" });
                }
                yield prisma_1.prisma.promotion.delete({
                    where: { promotion_id: promotionId },
                });
                res.json({ message: "Promotion deleted successfully" });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: "Failed to delete promotion" });
            }
        });
    }
}
exports.PromotionController = PromotionController;
