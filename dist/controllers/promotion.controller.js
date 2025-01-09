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
            try {
                const { eventId, type, value, promotionCode, startDate, expirationDate, maxUse, } = req.body;
                const existingPromo = yield prisma_1.prisma.promotion.findUnique({
                    where: { promotionCode },
                });
                if (existingPromo) {
                    return res.status(400).json({ error: "Promotion code already exists" });
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
                        useCount: 0,
                    },
                });
                res.status(201).json(promotion);
            }
            catch (error) {
                console.error("Error creating promotion:", error);
                res.status(500).json({ error: "Failed to create promotion" });
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
    verifyPromotion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { code, eventId } = req.body;
                const promotion = yield prisma_1.prisma.promotion.findFirst({
                    where: {
                        promotionCode: code,
                        eventId: parseInt(eventId),
                        expirationDate: {
                            gt: new Date(),
                        },
                        useCount: {
                            lt: prisma_1.prisma.promotion.fields.maxUse,
                        },
                    },
                });
                if (!promotion) {
                    return res.status(400).json({
                        valid: false,
                        message: "Invalid or expired promotion code",
                    });
                }
                res.json({
                    valid: true,
                    promotionCode: promotion.promotionCode,
                    value: promotion.value,
                    type: promotion.type,
                });
            }
            catch (error) {
                console.error("Promotion verification error:", error);
                res.status(500).json({ error: "Failed to verify promotion" });
            }
        });
    }
    checkPromoCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { code, ticketId } = req.body;
                const promotion = yield prisma_1.prisma.promotion.findFirst({
                    where: {
                        promotionCode: code,
                        event: {
                            tickets: {
                                some: {
                                    ticket_id: parseInt(ticketId),
                                },
                            },
                        },
                    },
                });
                if (!promotion) {
                    return res.status(404).json({ error: "Invalid promotion code" });
                }
                if (promotion.useCount >= promotion.maxUse) {
                    return res.status(400).json({ error: "Promotion code has expired" });
                }
                const ticket = yield prisma_1.prisma.ticket.findUnique({
                    where: { ticket_id: parseInt(ticketId) },
                });
                if (!ticket || ticket.price === null) {
                    return res
                        .status(404)
                        .json({ error: "Ticket not found or invalid price" });
                }
                const discount = promotion.type === "PERCENTAGE"
                    ? Math.floor((ticket.price * promotion.value) / 100)
                    : promotion.value;
                yield prisma_1.prisma.promotion.update({
                    where: { promotion_id: promotion.promotion_id },
                    data: { useCount: { increment: 1 } },
                });
                res.json({ discount });
            }
            catch (error) {
                console.error("Promo code check failed:", error);
                res.status(500).json({ error: "Failed to check promo code" });
            }
        });
    }
}
exports.PromotionController = PromotionController;
