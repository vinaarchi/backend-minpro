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
exports.TicketController = void 0;
const prisma_1 = require("../config/prisma");
const ResponseHandler_1 = __importDefault(require("../utils/ResponseHandler"));
class TicketController {
    addTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { eventId, type, ticketName, description, price, contactName, contactEmail, contactNumber, startDate, expiredDate, available, } = req.body;
            if (!eventId || !type || available === undefined) {
                return res.status(400).json({ error: "Missing required fields" });
            }
            if (type === "paid" && price === null) {
                return res
                    .status(400)
                    .json({ error: "Price is required for paid tickets" });
            }
            try {
                const event = yield prisma_1.prisma.event.findUnique({
                    where: { event_id: eventId },
                });
                if (!event) {
                    return res.status(404).json({ error: "XEvent not found" });
                }
                const ticket = yield prisma_1.prisma.ticket.create({
                    data: {
                        eventId,
                        type,
                        ticketName,
                        description,
                        price: type === "free" ? null : price,
                        contactName,
                        contactEmail,
                        contactNumber,
                        startDate,
                        expiredDate,
                        available,
                    },
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
                    return res.status(404).json({ error: "yEvent not found" });
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
    updateTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticketId = parseInt(req.params.id);
            const { ticketName, description, type, price, available, startDate, expiredDate, contactName, contactEmail, contactNumber, } = req.body;
            try {
                const ticket = yield prisma_1.prisma.ticket.findUnique({
                    where: { ticket_id: ticketId },
                });
                if (!ticket) {
                    return res.status(404).json({ error: "Ticket not found" });
                }
                const updatedTicket = yield prisma_1.prisma.ticket.update({
                    where: { ticket_id: ticketId },
                    data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (ticketName && { ticketName })), (description && { description })), (type && { type })), (price !== undefined && { price })), (available !== undefined && { available })), (startDate && { startDate: new Date(startDate) })), (expiredDate && { expiredDate: new Date(expiredDate) })), (contactName && { contactName })), (contactEmail && { contactEmail })), (contactNumber && { contactNumber })),
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
    // async getTicketById(req: Request, res: Response): Promise<any> {
    //   const ticketId = parseInt(req.params.id);
    //   try {
    //     const ticket = await prisma.ticket.findUnique({
    //       where: { ticket_id: ticketId },
    //     });
    //     if (!ticket) {
    //       return res.status(404).json({ error: "Ticket not found" });
    //     }
    //     res.json(ticket);
    //   } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ error: "Failed to fetch ticket details" });
    //   }
    // }
    getTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ticketId = parseInt(req.params.id);
                console.log("Looking for ticket:", ticketId);
                const ticket = yield prisma_1.prisma.ticket.findUnique({
                    where: {
                        ticket_id: ticketId,
                    },
                    include: {
                        event: true,
                    },
                });
                if (!ticket) {
                    return res.status(404).json({ error: "Ticket not found" });
                }
                console.log("Found ticket:", ticket);
                res.json(ticket);
            }
            catch (error) {
                console.error("Error fetching ticket:", error);
                res.status(500).json({ error: "Failed to fetch ticket details" });
            }
        });
    }
    //   async purchaseTicket(req: Request, res: Response): Promise<any> {
    //     const { ticketId, couponCode } = req.body; // ngambil ticketId dan couponCode dari request body
    //     try {
    //       const ticket = await prisma.ticket.findUnique({
    //         where: { ticket_id: ticketId }, // cari tiket berdasarkan ticketId
    //       });
    //       if (!ticket) {
    //         return res.status(404).json({ error: "Ticket not found" });
    //       }
    //       let finalPrice = ticket.price ?? 0; // inisialisasi finalPrice dengan harga tiket
    //       if (couponCode) {
    //         const isValidCoupon = await isDiscountCouponValid(couponCode); // cek apakah kode diskon valid
    //         if (isValidCoupon) {
    //           const discount = 10; // diskon 10%
    //           finalPrice = finalPrice * (1 - discount / 100); // hitung jumlah yang harus dibayar
    //         } else {
    //           return res.status(400).json({ error: "Invalid coupon code" });
    //         }
    //       }
    //       // lakukan pembayaran
    //       // const transaction = await prisma.ticket.create({
    //       //   data :{
    //       //     ticketId: ticket.ticket_id,
    //       //     userId: req.user.id,
    //       //     originalPrice: ticket.price,
    //       //     finalPrice: finalPrice,
    //       //     status: "paid"
    //       //   }
    //       // })
    //       res.status(201).send({
    //         message: "Payment successful",
    //         // transaction
    //       });
    //     } catch (error) {
    //       console.error(error);
    //       res.status(500).json({ error: "Failed to purchase ticket" });
    //     }
    //   }
    // }
    purchaseTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ticketId, promoCode, proofImage } = req.body;
            try {
                const ticket = yield prisma_1.prisma.ticket.findUnique({
                    where: { ticket_id: parseInt(ticketId) },
                    include: { event: true },
                });
                if (!ticket) {
                    return res.status(404).json({ error: "Ticket not found" });
                }
                let finalPrice = ticket.price || 0;
                if (promoCode) {
                    const promotion = yield prisma_1.prisma.promotion.findFirst({
                        where: {
                            promotionCode: promoCode,
                            eventId: ticket.eventId,
                            expirationDate: { gt: new Date() },
                        },
                    });
                    if (promotion && promotion.useCount < promotion.maxUse) {
                        const discount = promotion.type === "PERCENTAGE"
                            ? Math.floor((finalPrice * promotion.value) / 100)
                            : promotion.value;
                        finalPrice -= discount;
                        yield prisma_1.prisma.promotion.update({
                            where: { promotion_id: promotion.promotion_id },
                            data: { useCount: { increment: 1 } },
                        });
                    }
                }
                const transaction = yield prisma_1.prisma.transaction.create({
                    data: {
                        ticketId: ticket.ticket_id,
                        userId: 2,
                        proofImage: proofImage,
                        status: "SUCCESS",
                        finalPrice,
                        promotionCode: promoCode || null,
                    },
                });
                //update ticket availability
                yield prisma_1.prisma.ticket.update({
                    where: { ticket_id: ticket.ticket_id },
                    data: { available: { decrement: 1 } },
                });
                res.status(201).json({
                    message: "Transaction successful",
                    transaction,
                });
            }
            catch (error) {
                console.error("Transaction error:", error);
                res.status(500).json({ error: "Failed to process transaction" });
            }
        });
    }
    getTotalTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //buat dapetin siapa eo yang mau diliat
            const userId = parseInt(req.params.id);
            if (!userId) {
                return ResponseHandler_1.default.error(res, "User ID is required", 404);
            }
            try {
                const totalTickets = yield prisma_1.prisma.ticket.count({
                    where: {
                        event: {
                            organiserId: userId,
                        },
                    },
                });
                return ResponseHandler_1.default.success(res, "Total tickets successfully count", 200, totalTickets);
            }
            catch (error) {
                console.log(error);
                return ResponseHandler_1.default.error(res, "Failed to get total ticket count", 404);
            }
        });
    }
    getTotalCustomer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // buat dapetin siapa eo yang mau diliat
            const userId = parseInt(req.params.id);
            if (!userId) {
                return ResponseHandler_1.default.error(res, "User ID is required", 400);
            }
            try {
                const totalCustomers = yield prisma_1.prisma.ticket.count({
                    where: {
                        event: {
                            organiserId: userId,
                        },
                    },
                });
                return ResponseHandler_1.default.success(res, "Total Customer Successfully Count", 200, totalCustomers);
            }
            catch (error) {
                console.log(error);
                return ResponseHandler_1.default.error(res, "Failed to get total Customer", 404);
            }
        });
    }
}
exports.TicketController = TicketController;
