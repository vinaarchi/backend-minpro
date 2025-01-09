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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsController = void 0;
const prisma_1 = require("../config/prisma");
const cloudinary2_1 = __importDefault(require("../config/cloudinary2"));
const ResponseHandler_1 = __importDefault(require("../utils/ResponseHandler"));
//pagination
const paginate = (page, limit) => ({
    skip: (page - 1) * limit,
    take: limit,
});
class EventsController {
    getEvents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const search = req.query.search || "";
                const location = req.query.location || "";
                const topic = req.query.topic;
                console.log("Received query params:", {
                    page,
                    limit,
                    search,
                    location,
                    topic,
                });
                const conditions = [];
                if (search) {
                    conditions.push({
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    });
                }
                if (location) {
                    conditions.push({
                        location: {
                            contains: location,
                            mode: "insensitive",
                        },
                    });
                }
                if (topic) {
                    const categoryIds = yield prisma_1.prisma.eventCategory.findMany({
                        where: {
                            topic: { equals: topic },
                        },
                        select: { id: true },
                    });
                    console.log("Found category IDs for topic:", categoryIds);
                    conditions.push({
                        categoryId: {
                            in: categoryIds.map((c) => c.id),
                        },
                    });
                }
                const whereConditions = conditions.length > 0 ? { AND: conditions } : {};
                console.log("Final where conditions:", JSON.stringify(whereConditions, null, 2));
                const events = yield prisma_1.prisma.event.findMany(Object.assign(Object.assign({ where: whereConditions }, paginate(page, limit)), { orderBy: { date: "desc" }, include: {
                        locationDetail: true,
                        category: true,
                    } }));
                console.log("Found events:", events.length);
                const totalEvents = yield prisma_1.prisma.event.count({
                    where: whereConditions,
                });
                res.json({
                    events,
                    totalEvents,
                    totalPages: Math.ceil(totalEvents / limit),
                });
            }
            catch (error) {
                console.error("Error in getEvents:", error);
                res.status(500).json({ error: "Something went wrong" });
            }
        });
    }
    //get event details
    getEventDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const eventId = parseInt(req.params.id);
            try {
                const event = yield prisma_1.prisma.event.findUnique({
                    where: { event_id: eventId },
                    include: {
                        organiser: true,
                        locationDetail: true,
                        category: true,
                    },
                });
                if (!event) {
                    return res.status(404).json({ error: "Event not found" });
                }
                res.json(event);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: "Something went wrong" });
            }
        });
    }
    //create events
    createEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, date, time, location, organiserId, heldBy, category, image, locationDetailId, } = req.body;
            try {
                if (!name ||
                    !description ||
                    !date ||
                    !time ||
                    !location ||
                    !organiserId ||
                    !heldBy ||
                    !(category === null || category === void 0 ? void 0 : category.topic) ||
                    !(category === null || category === void 0 ? void 0 : category.format) ||
                    !locationDetailId) {
                    return res.status(400).json({
                        error: "Missing required fields",
                        received: {
                            name,
                            description,
                            date,
                            time,
                            location,
                            organiserId,
                            heldBy,
                            category,
                            image,
                            locationDetailId,
                        },
                    });
                }
                let eventCategory = yield prisma_1.prisma.eventCategory.findFirst({
                    where: {
                        AND: [{ topic: category.topic }, { format: category.format }],
                    },
                });
                if (!eventCategory) {
                    eventCategory = yield prisma_1.prisma.eventCategory.create({
                        data: {
                            topic: category.topic,
                            format: category.format,
                        },
                    });
                }
                // const organiserId = parseInt(req.params.organiserId);
                const event = yield prisma_1.prisma.event.create({
                    data: {
                        name,
                        description,
                        date: new Date(date),
                        time: new Date(`${date}T${time}`),
                        location,
                        organiserId: Number(organiserId),
                        heldBy,
                        categoryId: eventCategory.id,
                        image,
                        locationDetailId: Number(locationDetailId),
                    },
                    include: {
                        category: true,
                        locationDetail: true,
                    },
                });
                res.status(201).json(event);
            }
            catch (error) {
                console.error("Error creating event:", error);
                res.status(500).json({ error: "Failed to create event" });
            }
        });
    }
    //update event
    updateEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const eventId = parseInt(req.params.id);
            const { name, description, price, date, time, location, image } = req.body;
            try {
                const event = yield prisma_1.prisma.event.findUnique({
                    where: { event_id: eventId },
                });
                if (!event) {
                    return res.status(404).json({ error: "Event not found" });
                }
                const dateTime = date && time ? new Date(`${date}T${time}.000Z`) : null;
                if (date && time && isNaN(dateTime.getTime())) {
                    return res.status(400).json({ error: "Invalid date or time format" });
                }
                const updatedEvent = yield prisma_1.prisma.event.update({
                    where: { event_id: eventId },
                    data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (name && { name })), (description && { description })), (price !== undefined && { price })), (date && { date: new Date(date) })), (time && { time: dateTime })), (location && { location })), (image !== undefined && { image })),
                });
                res.json(updatedEvent);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: "Failed to update event" });
            }
        });
    }
    //delete event
    deleteEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const eventId = parseInt(req.params.id);
            try {
                const event = yield prisma_1.prisma.event.findUnique({
                    where: { event_id: eventId },
                });
                if (!event) {
                    return res.status(404).json({ error: "Event not found" });
                }
                yield prisma_1.prisma.event.delete({
                    where: { event_id: eventId },
                });
                res.json({ message: "Event deleted successfully" });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: "Failed to delete event" });
            }
        });
    }
    getTicketsByEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { eventId } = req.params;
            try {
                const tickets = yield prisma_1.prisma.ticket.findMany({
                    where: {
                        eventId: parseInt(eventId),
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                    include: {
                        event: {
                            select: {
                                name: true,
                                date: true,
                                time: true,
                                location: true,
                            },
                        },
                    },
                });
                if (!tickets) {
                    return res
                        .status(404)
                        .json({ error: "No tickets found for this event" });
                }
                res.json(tickets);
            }
            catch (error) {
                console.error("Error fetching tickets:", error);
                res.status(500).json({ error: "Failed to fetch tickets" });
            }
        });
    }
    uploadImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body.image) {
                    return res.status(400).json({ message: "Image data required" });
                }
                const fileStr = req.body.image;
                const fileFormat = fileStr.split(";")[0].split("/")[1];
                const validFormats = ["jpeg", "png", "jpg", "gif", "webp"];
                if (!validFormats.includes(fileFormat)) {
                    return res.status(400).json({ message: "Invalid image format" });
                }
                const base64Data = fileStr.split(",")[1];
                const fileSize = Buffer.from(base64Data, "base64").length;
                const maxSize = 5 * 1024 * 1024; //5MB
                if (fileSize > maxSize) {
                    return res.status(400).json({ message: "File size exceeds 5MB limit" });
                }
                const uploadResult = yield cloudinary2_1.default.uploader.upload(fileStr, {
                    folder: "events",
                    resource_type: "auto",
                    transformation: [{ quality: "auto:good" }, { fetch_format: "auto" }],
                });
                return res.json({
                    url: uploadResult.secure_url,
                    publicId: uploadResult.public_id,
                });
            }
            catch (error) {
                console.error("Upload error:", error);
                return res.status(500).json({
                    message: "Image upload failed",
                    error: process.env.NODE_ENV === "development" ? error : undefined,
                });
            }
        });
    }
    //reviw
    getEventReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const eventId = parseInt(req.params.id);
            try {
                const reviews = yield prisma_1.prisma.review.findMany({
                    where: { eventId },
                    include: {
                        user: {
                            select: {
                                username: true,
                                imgProfile: true,
                            },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                });
                res.json(reviews);
            }
            catch (error) {
                console.error("Error fetching reviews:", error);
                res.status(500).json({ error: "Failed to fetch reviews" });
            }
        });
    }
    addReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const eventId = parseInt(req.params.id);
            const { rating, comment, userId } = req.body;
            // const userId = 2;
            try {
                const newReview = yield prisma_1.prisma.review.create({
                    data: {
                        eventId,
                        userId,
                        rating,
                        comment,
                    },
                    include: {
                        user: {
                            select: {
                                username: true,
                                imgProfile: true,
                            },
                        },
                    },
                });
                res.status(201).json(newReview);
            }
            catch (error) {
                console.error("Error adding review:", error);
                res.status(500).json({ error: "Failed to add review" });
            }
        });
    }
    getTotalEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = parseInt(req.params.id);
            if (!userId) {
                return ResponseHandler_1.default.error(res, "User ID is required", 404);
            }
            try {
                const totalEvents = yield prisma_1.prisma.event.count({
                    where: {
                        organiserId: userId,
                    },
                });
                return ResponseHandler_1.default.success(res, "Get Total Event Success", 200, totalEvents);
            }
            catch (error) {
                console.log(error);
                return ResponseHandler_1.default.error(res, "Failed to Count the events", error.rc || 500, error);
            }
        });
    }
    getPromotionsForEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const eventId = parseInt(req.params.eventId);
            try {
                const promotions = yield prisma_1.prisma.promotion.findMany({
                    where: { eventId: eventId },
                    orderBy: {
                        createdAt: "desc",
                    },
                });
                res.json(promotions);
            }
            catch (error) {
                console.error("Error fetching promotions:", error);
                res.status(500).json({ error: "Failed to fetch promotions" });
            }
        });
    }
}
exports.EventsController = EventsController;
