import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export class PromotionController {
  //create promotion
  async addPromotion(req: Request, res: Response): Promise<any> {
    try {
      const {
        eventId,
        type,
        value,
        promotionCode,
        startDate,
        expirationDate,
        maxUse,
      } = req.body;

      const existingPromo = await prisma.promotion.findUnique({
        where: { promotionCode },
      });

      if (existingPromo) {
        return res.status(400).json({ error: "Promotion code already exists" });
      }

      const promotion = await prisma.promotion.create({
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
    } catch (error) {
      console.error("Error creating promotion:", error);
      res.status(500).json({ error: "Failed to create promotion" });
    }
  }

  //update promotion
  async updatePromotion(req: Request, res: Response): Promise<any> {
    const promotionId = parseInt(req.params.id);
    const {
      type,
      value,
      promotionCode,
      startDate,
      expirationDate,
      maxUse,
      useCount,
    } = req.body;

    try {
      const promotion = await prisma.promotion.findUnique({
        where: { promotion_id: promotionId },
      });

      if (!promotion) {
        return res.status(404).json({ error: "Promotion not found" });
      }

      const updatedPromotion = await prisma.promotion.update({
        where: { promotion_id: promotionId },
        data: {
          ...(type !== undefined && { type }),
          ...(value !== undefined && { value }),
          ...(promotionCode !== undefined && { promotionCode }),
          ...(startDate !== undefined && { startDate: new Date(startDate) }),
          ...(expirationDate !== undefined && {
            expirationDate: new Date(expirationDate),
          }),
          ...(maxUse !== undefined && { maxUse }),
          ...(useCount !== undefined && { useCount }),
        },
      });

      res.json(updatedPromotion);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update promotion" });
    }
  }

  //delete promotion
  async deletePromotion(req: Request, res: Response): Promise<any> {
    const promotionId = parseInt(req.params.id);

    try {
      const promotion = await prisma.promotion.findUnique({
        where: { promotion_id: promotionId },
      });

      if (!promotion) {
        return res.status(404).json({ error: "Promotion not found" });
      }

      await prisma.promotion.delete({
        where: { promotion_id: promotionId },
      });

      res.json({ message: "Promotion deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete promotion" });
    }
  }

  async verifyPromotion(req: Request, res: Response): Promise<any> {
    try {
      const { code, eventId } = req.body;

      const promotion = await prisma.promotion.findFirst({
        where: {
          promotionCode: code,
          eventId: parseInt(eventId),
          expirationDate: {
            gt: new Date(),
          },
          useCount: {
            lt: prisma.promotion.fields.maxUse,
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
    } catch (error) {
      console.error("Promotion verification error:", error);
      res.status(500).json({ error: "Failed to verify promotion" });
    }
  }
  async checkPromoCode(req: Request, res: Response): Promise<any> {
    try {
      const { code, ticketId } = req.body;

      const promotion = await prisma.promotion.findFirst({
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

      const ticket = await prisma.ticket.findUnique({
        where: { ticket_id: parseInt(ticketId) },
      });

      if (!ticket || ticket.price === null) {
        return res
          .status(404)
          .json({ error: "Ticket not found or invalid price" });
      }

      const discount =
        promotion.type === "PERCENTAGE"
          ? Math.floor((ticket.price * promotion.value) / 100)
          : promotion.value;

      await prisma.promotion.update({
        where: { promotion_id: promotion.promotion_id },
        data: { useCount: { increment: 1 } },
      });

      res.json({ discount });
    } catch (error) {
      console.error("Promo code check failed:", error);
      res.status(500).json({ error: "Failed to check promo code" });
    }
  }
}
