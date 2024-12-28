import { Request, Response } from "express";
import { prisma } from "../config/prisma";

//pagination
const paginate = (page: number, limit: number) => ({
  skip: (page - 1) * limit,
  take: limit,
});

export class EventsController {
  //get all events
  async getEvents(req: Request, res: Response): Promise<any> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || "";
      const location = (req.query.location as string) || "";

      const pagination = paginate(page, limit);

      const events = await prisma.event.findMany({
        where: {
          AND: [
            { name: { contains: search, mode: "insensitive" } },
            { location: { contains: location, mode: "insensitive" } },
          ],
        },
        ...pagination,
        orderBy: { date: "asc" },
        include: {
          locationDetail: true,
          category: true,
        },
      });

      const totalEvents = await prisma.event.count({
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
    } catch (error) {
      console.error(error);
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

  //create event
  async createEvent(req: Request, res: Response): Promise<any> {
    const {
      image,
      name,
      description,
      date,
      time,
      location,
      organiserId,
      heldBy,
      // categoryId,
      // locationDetailId,
    } = req.body;

    if (
      !name ||
      !date ||
      !time ||
      !location ||
      !organiserId ||
      !heldBy
      // !categoryId ||
      // !locationDetailId
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const organiser = await prisma.user.findUnique({
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

      const event = await prisma.event.create({
        data: {
          name,
          description,
          date: new Date(date),
          time: dateTime,
          location,
          organiserId,
          heldBy,
          // categoryId,
          // locationDetailId,
        },
      });

      res.status(201).json(event);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create event" });
    }
  }

  //update event
  async updateEvent(req: Request, res: Response): Promise<any> {
    const eventId = parseInt(req.params.id);
    const {
      name,
      description,
      price,
      date,
      time,
      location,
      // categoryId,
      // locationDetailId,
    } = req.body;

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

          // ...(categoryId && { categoryId }),
          // ...(locationDetailId && { locationDetailId })
          // ,
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

  // async getTicketsForEvent(req: Request, res: Response): Promise<any> {
  //   const eventId = parseInt(req.params.id);

  //   if (isNaN(eventId)) {
  //     return res.status(400).json({ error: "Invalid event ID" });
  //   }

  //   try {
  //     const tickets = await prisma.ticket.findMany({
  //       where: { eventId },
  //     });

  //     res.json(tickets);
  //   } catch (error) {
  //     console.error("Error fetching tickets:", error);
  //     res.status(500).json({ error: "Failed to fetch tickets" });
  //   }
  // }
}
