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
exports.EventsController = void 0;
const prisma_1 = require("../config/prisma");
//pagination
const paginate = (page, limit) => ({
    skip: (page - 1) * limit,
    take: limit,
});
class EventsController {
    //get all events
    getEvents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const search = req.query.search || "";
                const location = req.query.location || "";
                const pagination = paginate(page, limit);
                const events = yield prisma_1.prisma.event.findMany(Object.assign(Object.assign({ where: {
                        AND: [
                            { name: { contains: search, mode: "insensitive" } },
                            { location: { contains: location, mode: "insensitive" } },
                        ],
                    } }, pagination), { orderBy: { date: "asc" }, include: {
                        locationDetail: true,
                        category: true,
                    } }));
                const totalEvents = yield prisma_1.prisma.event.count({
                    where: {
                        AND: [
                            { name: { contains: search, mode: "insensitive" } },
                            { location: { contains: location, mode: "insensitive" } },
                        ],
                    },
                });
                res.json({
                    events,
                    totalEvents,
                    totalPages: Math.ceil(totalEvents / limit),
                });
            }
            catch (error) {
                console.error(error);
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
    //create event
    createEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, price, date, time, location, availableSeats, organiserId, categoryId, locationDetailId, } = req.body;
            if (!name ||
                !date ||
                !time ||
                !location ||
                !availableSeats ||
                !organiserId ||
                !categoryId ||
                !locationDetailId) {
                return res.status(400).json({ error: "Missing required fields" });
            }
            try {
                const organiser = yield prisma_1.prisma.user.findUnique({
                    where: { id: organiserId },
                });
                if (!organiser) {
                    return res.status(400).json({ error: "Organiser not found" });
                }
                if (organiser.role !== "ORGANIZER") {
                    return res.status(403).json({ error: "User is not an organizer" });
                }
                const dateTime = new Date(`${date}T${time}.000Z`);
                if (isNaN(dateTime.getTime())) {
                    return res.status(400).json({ error: "Invalid date or time format" });
                }
                const event = yield prisma_1.prisma.event.create({
                    data: {
                        name,
                        description,
                        price,
                        date: new Date(date),
                        time: dateTime,
                        location,
                        availableSeats,
                        organiserId,
                        categoryId,
                        locationDetailId,
                    },
                });
                res.status(201).json(event);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: "Failed to create event" });
            }
        });
    }
    //update event
    updateEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const eventId = parseInt(req.params.id);
            const { name, description, price, date, time, location, availableSeats, categoryId, locationDetailId, } = req.body;
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
                    data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (name && { name })), (description && { description })), (price !== undefined && { price })), (date && { date: new Date(date) })), (time && { time: dateTime })), (location && { location })), (availableSeats !== undefined && { availableSeats })), (categoryId && { categoryId })), (locationDetailId && { locationDetailId })),
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
}
exports.EventsController = EventsController;
