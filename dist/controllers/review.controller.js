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
exports.ReviewController = void 0;
const prisma_1 = require("../config/prisma");
class ReviewController {
    //add review
    addReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { eventId, userId, rating, comment } = req.body;
            console.log("Received review data:", { eventId, userId, rating, comment });
            if (!eventId || !userId || !rating) {
                return res.status(400).json({ error: "Missing required fields" });
            }
            if (rating < 1 || rating > 5) {
                return res.status(400).json({ error: "Rating must be between 1 and 5" });
            }
            try {
                const event = yield prisma_1.prisma.event.findUnique({
                    where: { event_id: eventId },
                });
                if (!event) {
                    return res.status(404).json({ error: "Event not found" });
                }
                //check if the user already review the event
                const existingReview = yield prisma_1.prisma.review.findFirst({
                    where: { eventId, userId },
                });
                if (existingReview) {
                    return res
                        .status(400)
                        .json({ error: "User has already reviewed this event" });
                }
                console.log("Creating review for user ID:", userId);
                const review = yield prisma_1.prisma.review.create({
                    data: { eventId, userId, rating, comment },
                    include: {
                        user: {
                            select: {
                                id: userId,
                                username: true,
                                imgProfile: true,
                            },
                        },
                    },
                });
                console.log("Created review:", review);
                res.status(201).json(review);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: "Failed to add review" });
            }
        });
    }
    //get reviews
    getEventReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const eventId = parseInt(req.params.eventId);
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            try {
                const reviews = yield prisma_1.prisma.review.findMany({
                    where: { eventId },
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { createdAt: "desc" },
                    include: {
                        user: { select: { id: true, fullname: true, email: true } },
                    },
                });
                const totalReviews = yield prisma_1.prisma.review.count({ where: { eventId } });
                res.json({
                    reviews,
                    totalReviews,
                    totalPages: Math.ceil(totalReviews / limit),
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: "Failed to fetch reviews" });
            }
        });
    }
    //update review
    updateReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const reviewId = parseInt(req.params.id);
            const { rating, comment } = req.body;
            if (rating && (rating < 1 || rating > 5)) {
                return res.status(400).json({ error: "Rating must be between 1 and 5" });
            }
            try {
                const review = yield prisma_1.prisma.review.findUnique({
                    where: { id: reviewId },
                });
                if (!review) {
                    return res.status(404).json({ error: "Review not found" });
                }
                const updatedReview = yield prisma_1.prisma.review.update({
                    where: { id: reviewId },
                    data: Object.assign(Object.assign({}, (rating !== undefined && { rating })), (comment !== undefined && { comment })),
                });
                res.json(updatedReview);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: "Failed to update review" });
            }
        });
    }
    //delete review
    deleteReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const reviewId = parseInt(req.params.id);
            try {
                const review = yield prisma_1.prisma.review.findUnique({
                    where: { id: reviewId },
                });
                if (!review) {
                    return res.status(404).json({ error: "Review not found" });
                }
                yield prisma_1.prisma.review.delete({ where: { id: reviewId } });
                res.json({ message: "Review deleted successfully" });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: "Failed to delete review" });
            }
        });
    }
}
exports.ReviewController = ReviewController;
