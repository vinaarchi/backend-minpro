// import { Request, Response } from "express";
// import { prisma } from "../config/prisma";
// import { Prisma } from "@prisma/client";
// //pagination
// const paginate = (page: number, limit: number) => ({
//   skip: (page - 1) * limit,
//   take: limit,
// });
// declare global {
//   namespace Express {
//     interface Request {
//       user?: {
//         id: number;
//         role: string;
//       };
//     }
//   }
// }

// export class EventsController {
//   async getEvents(req: Request, res: Response): Promise<any> {
//     try {
//       const page = parseInt(req.query.page as string) || 1;
//       const limit = parseInt(req.query.limit as string) || 10;
//       const search = (req.query.search as string) || "";
//       const location = (req.query.location as string) || "";
//       const topic = req.query.topic as string;

//       console.log("Received query params:", {
//         page,
//         limit,
//         search,
//         location,
//         topic,
//       });

//       const conditions: Prisma.EventWhereInput[] = [];

//       if (search) {
//         conditions.push({
//           name: {
//             contains: search,
//             mode: "insensitive",
//           },
//         });
//       }

//       if (location) {
//         conditions.push({
//           location: {
//             contains: location,
//             mode: "insensitive",
//           },
//         });
//       }

//       if (topic) {
//         const categoryIds = await prisma.eventCategory.findMany({
//           where: {
//             topic: { equals: topic },
//           },
//           select: { id: true },
//         });

//         console.log("Found category IDs for topic:", categoryIds);

//         conditions.push({
//           categoryId: {
//             in: categoryIds.map((c) => c.id),
//           },
//         });
//       }

//       const whereConditions: Prisma.EventWhereInput =
//         conditions.length > 0 ? { AND: conditions } : {};

//       console.log(
//         "Final where conditions:",
//         JSON.stringify(whereConditions, null, 2)
//       );

//       const events = await prisma.event.findMany({
//         where: whereConditions,
//         ...paginate(page, limit),
//         orderBy: { date: "asc" },
//         include: {
//           locationDetail: true,
//           category: true,
//         },
//       });

//       console.log("Found events:", events.length);

//       const totalEvents = await prisma.event.count({
//         where: whereConditions,
//       });

//       res.json({
//         events,
//         totalEvents,
//         totalPages: Math.ceil(totalEvents / limit),
//       });
//     } catch (error) {
//       console.error("Error in getEvents:", error);
//       res.status(500).json({ error: "Something went wrong" });
//     }
//   }

//   //get event details
//   async getEventDetails(req: Request, res: Response): Promise<any> {
//     const eventId = parseInt(req.params.id);

//     try {
//       const event = await prisma.event.findUnique({
//         where: { event_id: eventId },
//         include: {
//           organiser: true,
//           locationDetail: true,
//           category: true,
//         },
//       });

//       if (!event) {
//         return res.status(404).json({ error: "Event not found" });
//       }

//       res.json(event);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Something went wrong" });
//     }
//   }

//   // async createEvent(req: Request, res: Response): Promise<any> {
//   //   const {
//   //     name,
//   //     description,
//   //     date,
//   //     time,
//   //     location,
//   //     organiserId,
//   //     heldBy,
//   //     category,
//   //   } = req.body;

//   //   try {
//   //     if (
//   //       !name ||
//   //       !description ||
//   //       !date ||
//   //       !time ||
//   //       !location ||
//   //       !organiserId ||
//   //       !heldBy ||
//   //       !category?.topic ||
//   //       !category?.format
//   //     ) {
//   //       return res.status(400).json({
//   //         error: "Missing required fields",
//   //         received: {
//   //           name,
//   //           description,
//   //           date,
//   //           time,
//   //           location,
//   //           organiserId,
//   //           heldBy,
//   //           category,
//   //         },
//   //       });
//   //     }

//   //     let eventCategory = await prisma.eventCategory.findFirst({
//   //       where: {
//   //         AND: [{ topic: category.topic }, { format: category.format }],
//   //       },
//   //     });

//   //     if (!eventCategory) {
//   //       eventCategory = await prisma.eventCategory.create({
//   //         data: {
//   //           topic: category.topic,
//   //           format: category.format,
//   //         },
//   //       });
//   //     }

//   //     const event = await prisma.event.create({
//   //       data: {
//   //         name,
//   //         description,
//   //         date: new Date(date),
//   //         time: new Date(`${date}T${time}`),
//   //         location,
//   //         organiserId,
//   //         heldBy,
//   //         categoryId: eventCategory.id,
//   //       },
//   //       include: {
//   //         category: true,
//   //       },
//   //     });

//   //     res.status(201).json(event);
//   //   } catch (error) {
//   //     console.error("Error creating event:", error);
//   //     res.status(500).json({ error: "Failed to create event" });
//   //   }
//   // }
//   //create evenr
//   async createEvent(req: Request, res: Response): Promise<any> {
//     const { name, description, date, time, location, heldBy, category } =
//       req.body;

//     try {
//       const organiserId = req.user?.id;

//       if (!organiserId) {
//         return res.status(401).json({ error: "User not authenticated" });
//       }

//       if (
//         !name ||
//         !description ||
//         !date ||
//         !time ||
//         !location ||
//         !heldBy ||
//         !category?.topic ||
//         !category?.format
//       ) {
//         return res.status(400).json({
//           error: "Missing required fields",
//           received: {
//             name,
//             description,
//             date,
//             time,
//             location,
//             heldBy,
//             category,
//           },
//         });
//       }

//       const user = await prisma.user.findUnique({
//         where: { id: organiserId },
//       });

//       if (!user || user.role !== "ORGANIZER") {
//         return res
//           .status(403)
//           .json({ error: "User must be an organizer to create events" });
//       }

//       let eventCategory = await prisma.eventCategory.findFirst({
//         where: {
//           AND: [{ topic: category.topic }, { format: category.format }],
//         },
//       });

//       if (!eventCategory) {
//         eventCategory = await prisma.eventCategory.create({
//           data: {
//             topic: category.topic,
//             format: category.format,
//           },
//         });
//       }

//       const event = await prisma.event.create({
//         data: {
//           name,
//           description,
//           date: new Date(date),
//           time: new Date(`${date}T${time}`),
//           location,
//           organiserId,
//           heldBy,
//           categoryId: eventCategory.id,
//         },
//         include: {
//           category: true,
//           organiser: true,
//         },
//       });

//       res.status(201).json(event);
//     } catch (error) {
//       console.error("Error creating event:", error);
//     }
//   }

//   //update event
//   async updateEvent(req: Request, res: Response): Promise<any> {
//     const eventId = parseInt(req.params.id);
//     const {
//       name,
//       description,
//       price,
//       date,
//       time,
//       location,
//       // categoryId,
//       // locationDetailId,
//     } = req.body;

//     try {
//       const event = await prisma.event.findUnique({
//         where: { event_id: eventId },
//       });

//       if (!event) {
//         return res.status(404).json({ error: "Event not found" });
//       }

//       const dateTime = date && time ? new Date(`${date}T${time}.000Z`) : null;
//       if (date && time && isNaN(dateTime!.getTime())) {
//         return res.status(400).json({ error: "Invalid date or time format" });
//       }

//       const updatedEvent = await prisma.event.update({
//         where: { event_id: eventId },
//         data: {
//           ...(name && { name }),
//           ...(description && { description }),
//           ...(price !== undefined && { price }),
//           ...(date && { date: new Date(date) }),
//           ...(time && { time: dateTime }),
//           ...(location && { location }),

//           // ...(categoryId && { categoryId }),
//           // ...(locationDetailId && { locationDetailId })
//           // ,
//         },
//       });

//       res.json(updatedEvent);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Failed to update event" });
//     }
//   }

//   //delete event
//   async deleteEvent(req: Request, res: Response): Promise<any> {
//     const eventId = parseInt(req.params.id);

//     try {
//       const event = await prisma.event.findUnique({
//         where: { event_id: eventId },
//       });

//       if (!event) {
//         return res.status(404).json({ error: "Event not found" });
//       }

//       await prisma.event.delete({
//         where: { event_id: eventId },
//       });

//       res.json({ message: "Event deleted successfully" });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Failed to delete event" });
//     }
//   }
//   async getTicketsByEvent(req: Request, res: Response): Promise<any> {
//     const { eventId } = req.params;
//     try {
//       const tickets = await prisma.ticket.findMany({
//         where: {
//           eventId: parseInt(eventId),
//         },
//         orderBy: {
//           createdAt: "desc",
//         },
//         include: {
//           event: {
//             select: {
//               name: true,
//               date: true,
//               time: true,
//               location: true,
//             },
//           },
//         },
//       });

//       if (!tickets) {
//         return res
//           .status(404)
//           .json({ error: "No tickets found for this event" });
//       }

//       res.json(tickets);
//     } catch (error) {
//       console.error("Error fetching tickets:", error);
//       res.status(500).json({ error: "Failed to fetch tickets" });
//     }
//   }
// }
