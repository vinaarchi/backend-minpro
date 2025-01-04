import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { isDiscountCouponValid } from "../services/discount.service";

export class TicketController {
  async addTicket(req: Request, res: Response): Promise<any> {
    const {
      eventId,
      type,
      ticketName,
      description,
      price,
      contactName,
      contactEmail,
      contactNumber,
      startDate,
      expiredDate,
      available,
    } = req.body;

    if (!eventId || !type || available === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (type === "paid" && price === null) {
      return res
        .status(400)
        .json({ error: "Price is required for paid tickets" });
    }

    try {
      const event = await prisma.event.findUnique({
        where: { event_id: eventId },
      });

      if (!event) {
        return res.status(404).json({ error: "XEvent not found" });
      }

      const ticket = await prisma.ticket.create({
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
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to add ticket" });
    }
  }
  //get all tickets
  async getTicketsForEvent(req: Request, res: Response): Promise<any> {
    const eventId = parseInt(req.params.eventId);

    try {
      const event = await prisma.event.findUnique({
        where: { event_id: eventId },
      });

      if (!event) {
        return res.status(404).json({ error: "yEvent not found" });
      }
      const tickets = await prisma.ticket.findMany({
        where: { eventId },
      });

      res.json(tickets);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch tickets" });
    }
  }

  async updateTicket(req: Request, res: Response): Promise<any> {
    const ticketId = parseInt(req.params.id);
    const {
      ticketName,
      description,
      type,
      price,
      available,
      startDate,
      expiredDate,
      contactName,
      contactEmail,
      contactNumber,
    } = req.body;

    try {
      const ticket = await prisma.ticket.findUnique({
        where: { ticket_id: ticketId },
      });

      if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
      }

      const updatedTicket = await prisma.ticket.update({
        where: { ticket_id: ticketId },
        data: {
          ...(ticketName && { ticketName }),
          ...(description && { description }),
          ...(type && { type }),
          ...(price !== undefined && { price }),
          ...(available !== undefined && { available }),
          ...(startDate && { startDate: new Date(startDate) }),
          ...(expiredDate && { expiredDate: new Date(expiredDate) }),
          ...(contactName && { contactName }),
          ...(contactEmail && { contactEmail }),
          ...(contactNumber && { contactNumber }),
        },
      });

      res.json(updatedTicket);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update ticket" });
    }
  }

  //delete ticket
  async deleteTicket(req: Request, res: Response): Promise<any> {
    const ticketId = parseInt(req.params.id);

    try {
      const ticket = await prisma.ticket.findUnique({
        where: { ticket_id: ticketId },
      });

      if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
      }

      await prisma.ticket.delete({
        where: { ticket_id: ticketId },
      });

      res.json({ message: "Ticket deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete ticket" });
    }
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
  async getTicket(req: Request, res: Response): Promise<any> {
    try {
      const ticketId = parseInt(req.params.id);
      console.log("Looking for ticket:", ticketId);

      const ticket = await prisma.ticket.findUnique({
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
    } catch (error) {
      console.error("Error fetching ticket:", error);
      res.status(500).json({ error: "Failed to fetch ticket details" });
    }
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
  async purchaseTicket(req: Request, res: Response): Promise<any> {
    const { ticketId, promoCode, proofImage } = req.body;

    try {
      const ticket = await prisma.ticket.findUnique({
        where: { ticket_id: parseInt(ticketId) },
        include: { event: true },
      });

      if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
      }

      let finalPrice = ticket.price || 0;

      if (promoCode) {
        const promotion = await prisma.promotion.findFirst({
          where: {
            promotionCode: promoCode,
            eventId: ticket.eventId,
            expirationDate: { gt: new Date() },
          },
        });

        if (promotion && promotion.useCount < promotion.maxUse) {
          const discount =
            promotion.type === "PERCENTAGE"
              ? Math.floor((finalPrice * promotion.value) / 100)
              : promotion.value;
          finalPrice -= discount;

          await prisma.promotion.update({
            where: { promotion_id: promotion.promotion_id },
            data: { useCount: { increment: 1 } },
          });
        }
      }

      const transaction = await prisma.transaction.create({
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
      await prisma.ticket.update({
        where: { ticket_id: ticket.ticket_id },
        data: { available: { decrement: 1 } },
      });

      res.status(201).json({
        message: "Transaction successful",
        transaction,
      });
    } catch (error) {
      console.error("Transaction error:", error);
      res.status(500).json({ error: "Failed to process transaction" });
    }
  }
}
