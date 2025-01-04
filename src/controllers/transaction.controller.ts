import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import cloudinary from "../config/cloudinary2";
import multer from "multer";

export class TransactionController {
  async createTransaction(req: Request, res: Response): Promise<any> {
    try {
      const { ticketId, userId, promoCode, finalPrice, proofImage } = req.body;

      if (!ticketId || !userId || !finalPrice) {
        return res.status(400).json({
          error: "Missing required fields",
          details: "ticketId, userId, and finalPrice are required",
        });
      }

      //cek apakah tiket tersedia
      const ticket = await prisma.ticket.findUnique({
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
          const uploadResult = await cloudinary.uploader.upload(proofImage, {
            folder: "payment-proofs",
          });
          imageUrl = uploadResult.secure_url;
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          return res.status(500).json({ error: "Failed to upload image" });
        }
      }

      const transaction = await prisma.transaction.create({
        data: {
          ticketId: Number(ticketId),
          userId: Number(userId),
          proofImage: imageUrl,
          finalPrice: Number(finalPrice),
          promotionCode: promoCode || null,
          status: "SUCCESS",
        },
      });

      await prisma.ticket.update({
        where: { ticket_id: Number(ticketId) },
        data: {
          available: {
            decrement: 1,
          },
        },
      });

      return res.status(201).json(transaction);
    } catch (error) {
      console.error("Transaction error:", error);
      return res.status(500).json({
        error: "Failed to create transaction",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getUserTransactions(req: Request, res: Response): Promise<any> {
    try {
      const userId = parseInt(req.params.userId);

      const transactions = await prisma.transaction.findMany({
        where: {
          userId: 2,
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
    } catch (error) {
      console.error("Error fetching user transactions:", error);
      return res.status(500).json({
        error: "Failed to fetch transactions",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
