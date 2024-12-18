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
exports.TicketController = void 0;
const prisma_1 = require("../config/prisma");
class TicketController {
    //create ticket
    addTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { eventId, ticketType, price, available } = req.body;
            if (!eventId || !ticketType || !price || available === undefined) {
                return res.status(400).json({ error: "Missing required fields" });
            }
            try {
                const event = yield prisma_1.prisma.event.findUnique({
                    where: { event_id: eventId },
                });
                if (!event) {
                    return res.status(404).json({ error: "Event not found" });
                }
                const ticket = yield prisma_1.prisma.ticket.create({
                    data: { eventId, ticketType, price, available },
                });
                res.status(201).json(ticket);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: "Failed to add ticket" });
            }
        });
    }
    //get all tickets
    getTicketsForEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const eventId = parseInt(req.params.eventId);
            try {
                const event = yield prisma_1.prisma.event.findUnique({
                    where: { event_id: eventId },
                });
                if (!event) {
                    return res.status(404).json({ error: "Event not found" });
                }
                const tickets = yield prisma_1.prisma.ticket.findMany({
                    where: { eventId },
                });
                res.json(tickets);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: "Failed to fetch tickets" });
            }
        });
    }
    //update ticket
    updateTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticketId = parseInt(req.params.id);
            const { ticketType, price, available } = req.body;
            try {
                const ticket = yield prisma_1.prisma.ticket.findUnique({
                    where: { ticket_id: ticketId },
                });
                if (!ticket) {
                    return res.status(404).json({ error: "Ticket not found" });
                }
                const updatedTicket = yield prisma_1.prisma.ticket.update({
                    where: { ticket_id: ticketId },
                    data: Object.assign(Object.assign(Object.assign({}, (ticketType !== undefined && { ticketType })), (price !== undefined && { price })), (available !== undefined && { available })),
                });
                res.json(updatedTicket);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: "Failed to update ticket" });
            }
        });
    }
    //delete ticket
    deleteTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticketId = parseInt(req.params.id);
            try {
                const ticket = yield prisma_1.prisma.ticket.findUnique({
                    where: { ticket_id: ticketId },
                });
                if (!ticket) {
                    return res.status(404).json({ error: "Ticket not found" });
                }
                yield prisma_1.prisma.ticket.delete({
                    where: { ticket_id: ticketId },
                });
                res.json({ message: "Ticket deleted successfully" });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: "Failed to delete ticket" });
            }
        });
    }
}
exports.TicketController = TicketController;
