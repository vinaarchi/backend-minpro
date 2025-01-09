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
exports.TransactionController = void 0;
const prisma_1 = require("../config/prisma");
const cloudinary2_1 = __importDefault(require("../config/cloudinary2"));
const ResponseHandler_1 = __importDefault(require("../utils/ResponseHandler"));
class TransactionController {
    createTransaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { ticketId, userId, promoCode, finalPrice, proofImage } = req.body;
                if (!ticketId || !userId) {
                    return res.status(400).json({
                        error: "Missing required fields",
                        details: "ticketId, userId, and finalPrice are required",
                    });
                }
                //cek apakah tiket tersedia
                const ticket = yield prisma_1.prisma.ticket.findUnique({
                    where: { ticket_id: Number(ticketId) },
                });
                if (!ticket) {
                    return res.status(404).json({ error: "Ticket not found" });
                }
                if (ticket.available <= 0) {
                    return res.status(400).json({ error: "Ticket is sold out" });
                }
                //o
                let imageUrl = "";
                if (proofImage) {
                    try {
                        const uploadResult = yield cloudinary2_1.default.uploader.upload(proofImage, {
                            folder: "payment-proofs",
                        });
                        imageUrl = uploadResult.secure_url;
                    }
                    catch (uploadError) {
                        console.error("Image upload failed:", uploadError);
                        return res.status(500).json({ error: "Failed to upload image" });
                    }
                }
                const transaction = yield prisma_1.prisma.transaction.create({
                    data: {
                        ticketId: Number(ticketId),
                        userId: Number(userId),
                        proofImage: imageUrl,
                        finalPrice: Number(finalPrice),
                        promotionCode: promoCode || null,
                        status: "SUCCESS",
                    },
                });
                yield prisma_1.prisma.ticket.update({
                    where: { ticket_id: Number(ticketId) },
                    data: {
                        available: {
                            decrement: 1,
                        },
                    },
                });
                return res.status(201).json(transaction);
            }
            catch (error) {
                console.error("Transaction error:", error);
                return res.status(500).json({
                    error: "Failed to create transaction",
                    details: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
    }
    getUserTransactions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = parseInt(req.params.userId);
                const transactions = yield prisma_1.prisma.transaction.findMany({
                    where: {
                        userId: userId,
                    },
                    include: {
                        ticket: {
                            include: {
                                event: {
                                    select: {
                                        name: true,
                                        date: true,
                                        time: true,
                                        location: true,
                                        image: true,
                                    },
                                },
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                });
                return res.json(transactions);
            }
            catch (error) {
                console.error("Error fetching user transactions:", error);
                return res.status(500).json({
                    error: "Failed to fetch transactions",
                    details: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
    }
    //stats
    getOrganizerEventStats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const organizerId = parseInt(req.params.organizerId);
                const events = yield prisma_1.prisma.event.findMany({
                    where: {
                        organiserId: organizerId,
                    },
                    include: {
                        tickets: {
                            include: {
                                transactions: {
                                    select: {
                                        finalPrice: true,
                                        createdAt: true,
                                        status: true,
                                    },
                                },
                            },
                        },
                    },
                });
                const eventStats = events.map((event) => {
                    const totalTickets = event.tickets.reduce((sum, ticket) => {
                        const soldTickets = ticket.transactions.filter((t) => t.status === "SUCCESS").length;
                        return sum + soldTickets;
                    }, 0);
                    const totalEarnings = event.tickets.reduce((sum, ticket) => {
                        const successfulTransactions = ticket.transactions
                            .filter((t) => t.status === "SUCCESS")
                            .reduce((transactionSum, t) => transactionSum + t.finalPrice, 0);
                        return sum + successfulTransactions;
                    }, 0);
                    return {
                        eventId: event.event_id,
                        eventName: event.name,
                        eventDate: event.date,
                        ticketsSold: totalTickets,
                        earnings: totalEarnings,
                    };
                });
                const monthlyStats = eventStats.reduce((acc, event) => {
                    const month = event.eventDate.getMonth();
                    const year = event.eventDate.getFullYear();
                    const key = `${year}-${month + 1}`;
                    if (!acc[key]) {
                        acc[key] = {
                            month: month + 1,
                            year,
                            events: 0,
                            earnings: 0,
                            ticketsSold: 0,
                        };
                    }
                    acc[key].events += 1;
                    acc[key].earnings += event.earnings;
                    acc[key].ticketsSold += event.ticketsSold;
                    return acc;
                }, {});
                const overallStats = {
                    totalEvents: events.length,
                    totalTicketsSold: eventStats.reduce((sum, event) => sum + event.ticketsSold, 0),
                    totalEarnings: eventStats.reduce((sum, event) => sum + event.earnings, 0),
                };
                return res.json({
                    overallStats,
                    monthlyBreakdown: Object.values(monthlyStats).sort((a, b) => {
                        if (a.year !== b.year)
                            return b.year - a.year;
                        return b.month - a.month;
                    }),
                    eventDetails: eventStats.sort((a, b) => b.eventDate.getTime() - a.eventDate.getTime()),
                });
            }
            catch (error) {
                console.error("Error fetching organizer stats:", error);
                return res.status(500).json({
                    error: "Failed to fetch organizer statistics",
                    details: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
    }
    getTotalTransaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // dapetin user id nya
                const userId = parseInt(req.params.organiserId, 10);
                // mencari semua event yang dibuat oleh 1 user
                const events = yield prisma_1.prisma.event.findMany({
                    where: { organiserId: userId },
                    include: {
                        tickets: {
                            include: {
                                transactions: {
                                    select: {
                                        finalPrice: true,
                                        status: true,
                                    },
                                },
                            },
                        },
                    },
                });
                if (events.length === 0) {
                    return ResponseHandler_1.default.error(res, "No events found for this user", 400);
                }
                // ini ngitung total transaksi dari semua event yang ditemukan
                let totalTransaction = 0;
                events.forEach((event) => {
                    event.tickets.forEach((ticket) => {
                        ticket.transactions.forEach((transaction) => {
                            if (transaction.status === "SUCCESS") {
                                totalTransaction += transaction.finalPrice;
                            }
                        });
                    });
                });
                return ResponseHandler_1.default.success(res, "Success get all Total", 200, totalTransaction);
            }
            catch (error) {
                console.log(error);
                return ResponseHandler_1.default.error(res, "Failed to fetch total transaction", 400);
            }
        });
    }
}
exports.TransactionController = TransactionController;
