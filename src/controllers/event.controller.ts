import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { Prisma } from "@prisma/client";
import cloudinary from "../config/cloudinary2";
//pagination
const paginate = (page: number, limit: number) => ({
  skip: (page - 1) * limit,
  take: limit,
});
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: string;
      };
    }
  }
}

export class EventsController {
  async getEvents(req: Request, res: Response): Promise<any> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || "";
      const location = (req.query.location as string) || "";
      const topic = req.query.topic as string;

      console.log("Received query params:", {
        page,
        limit,
        search,
        location,
        topic,
      });

      const conditions: any = [];

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
        const categoryIds = await prisma.eventCategory.findMany({
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

      const whereConditions: any =
        conditions.length > 0 ? { AND: conditions } : {};

      console.log(
        "Final where conditions:",
        JSON.stringify(whereConditions, null, 2)
      );

      const events = await prisma.event.findMany({
        where: whereConditions,
        ...paginate(page, limit),
        orderBy: { date: "desc" },
        include: {
          locationDetail: true,
          category: true,
        },
      });

      console.log("Found events:", events.length);

      const totalEvents = await prisma.event.count({
        where: whereConditions,
      });

      res.json({
        events,
        totalEvents,
        totalPages: Math.ceil(totalEvents / limit),
      });
    } catch (error) {
      console.error("Error in getEvents:", error);
      res.status(500).json({ error: "Something went wrong" });
    }
  }

  //get event details
  async getEventDetails(req: Request, res: Response): Promise<any> {
    const eventId = parseInt(req.params.id);

    try {
      const event = await prisma.event.findUnique({
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
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  }

  async createEvent(req: Request, res: Response): Promise<any> {
    const {
      name,
      description,
      date,
      time,
      location,
      organiserId,
      heldBy,
      category,
      image,
    } = req.body;

    try {
      if (
        !name ||
        !description ||
        !date ||
        !time ||
        !location ||
        !organiserId ||
        !heldBy ||
        !category?.topic ||
        !category?.format
      ) {
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
          },
        });
      }

      let eventCategory = await prisma.eventCategory.findFirst({
        where: {
          AND: [{ topic: category.topic }, { format: category.format }],
        },
      });

      if (!eventCategory) {
        eventCategory = await prisma.eventCategory.create({
          data: {
            topic: category.topic,
            format: category.format,
          },
        });
      }

      const event = await prisma.event.create({
        data: {
          name,
          description,
          date: new Date(date),
          time: new Date(`${date}T${time}`),
          location,
          organiserId,
          heldBy,
          categoryId: eventCategory.id,
          image,
        },
        include: {
          category: true,
        },
      });

      res.status(201).json(event);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ error: "Failed to create event" });
    }
  }
  // create evenr
  // async createEvent(req: Request, res: Response): Promise<any> {
  //   const { name, description, date, time, location, heldBy, category } =
  //     req.body;

  //   try {
  //     const organiserId = req.user?.id;

  //     if (!organiserId) {
  //       return res.status(401).json({ error: "User not authenticated" });
  //     }

  //     if (
  //       !name ||
  //       !description ||
  //       !date ||
  //       !time ||
  //       !location ||
  //       !heldBy ||
  //       !category?.topic ||
  //       !category?.format
  //     ) {
  //       return res.status(400).json({
  //         error: "Missing required fields",
  //         received: {
  //           name,
  //           description,
  //           date,
  //           time,
  //           location,
  //           heldBy,
  //           category,
  //         },
  //       });
  //     }

  //     const user = await prisma.user.findUnique({
  //       where: { id: organiserId },
  //     });

  //     if (!user || user.role !== "ORGANIZER") {
  //       return res
  //         .status(403)
  //         .json({ error: "User must be an organizer to create events" });
  //     }

  //     let eventCategory = await prisma.eventCategory.findFirst({
  //       where: {
  //         AND: [{ topic: category.topic }, { format: category.format }],
  //       },
  //     });

  //     if (!eventCategory) {
  //       eventCategory = await prisma.eventCategory.create({
  //         data: {
  //           topic: category.topic,
  //           format: category.format,
  //         },
  //       });
  //     }

  //     const event = await prisma.event.create({
  //       data: {
  //         name,
  //         description,
  //         date: new Date(date),
  //         time: new Date(`${date}T${time}`),
  //         location,
  //         organiserId,
  //         heldBy,
  //         categoryId: eventCategory.id,
  //       },
  //       include: {
  //         category: true,
  //         organiser: true,
  //       },
  //     });

  //     res.status(201).json(event);
  //   } catch (error) {
  //     console.error("Error creating event:", error);
  //   }
  // }

  //update event
  async updateEvent(req: Request, res: Response): Promise<any> {
    const eventId = parseInt(req.params.id);
    const { name, description, price, date, time, location, image } = req.body;

    try {
      const event = await prisma.event.findUnique({
        where: { event_id: eventId },
      });

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      const dateTime = date && time ? new Date(`${date}T${time}.000Z`) : null;
      if (date && time && isNaN(dateTime!.getTime())) {
        return res.status(400).json({ error: "Invalid date or time format" });
      }

      const updatedEvent = await prisma.event.update({
        where: { event_id: eventId },
        data: {
          ...(name && { name }),
          ...(description && { description }),
          ...(price !== undefined && { price }),
          ...(date && { date: new Date(date) }),
          ...(time && { time: dateTime }),
          ...(location && { location }),
          ...(image !== undefined && { image }),
        },
      });

      res.json(updatedEvent);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update event" });
    }
  }
  //delete event
  async deleteEvent(req: Request, res: Response): Promise<any> {
    const eventId = parseInt(req.params.id);

    try {
      const event = await prisma.event.findUnique({
        where: { event_id: eventId },
      });

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      await prisma.event.delete({
        where: { event_id: eventId },
      });

      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete event" });
    }
  }
  async getTicketsByEvent(req: Request, res: Response): Promise<any> {
    const { eventId } = req.params;
    try {
      const tickets = await prisma.ticket.findMany({
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
    } catch (error) {
      console.error("Error fetching tickets:", error);
      res.status(500).json({ error: "Failed to fetch tickets" });
    }
  }

  async uploadImage(req: Request, res: Response): Promise<any> {
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

      const uploadResult = await cloudinary.uploader.upload(fileStr, {
        folder: "events",
        resource_type: "auto",
        transformation: [{ quality: "auto:good" }, { fetch_format: "auto" }],
      });

      return res.json({
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      });
    } catch (error) {
      console.error("Upload error:", error);
      return res.status(500).json({
        message: "Image upload failed",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      });
    }
  }

  //reviw
  async getEventReviews(req: Request, res: Response): Promise<any> {
    const eventId = parseInt(req.params.id);

    try {
      const reviews = await prisma.review.findMany({
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
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  }

  async addReview(req: Request, res: Response): Promise<any> {
    const eventId = parseInt(req.params.id);
    const { rating, comment } = req.body;
    const userId = 2;

    try {
      const newReview = await prisma.review.create({
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
    } catch (error) {
      console.error("Error adding review:", error);
      res.status(500).json({ error: "Failed to add review" });
    }
  }
}
