import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class EventCategoryController {
  //create a new event category
  async createCategory(req: Request, res: Response): Promise<any> {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    try {
      const category = await prisma.eventCategory.create({
        data: { name, description },
      });

      res.status(201).json(category);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create event category" });
    }
  }

  //get all event categories
  async getAllCategories(req: Request, res: Response): Promise<any> {
    try {
      const categories = await prisma.eventCategory.findMany();
      res.status(200).json(categories);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch event categories" });
    }
  }

  //get a single category by id
  async getCategoryById(req: Request, res: Response): Promise<any> {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    try {
      const category = await prisma.eventCategory.findUnique({
        where: { id },
      });

      if (!category) {
        return res.status(404).json({ error: "Event category not found" });
      }

      res.status(200).json(category);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch event category" });
    }
  }

  //update an event category
  async updateCategory(req: Request, res: Response): Promise<any> {
    const id = parseInt(req.params.id);
    const { name, description } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    try {
      const category = await prisma.eventCategory.findUnique({
        where: { id },
      });

      if (!category) {
        return res.status(404).json({ error: "Event category not found" });
      }

      const updatedCategory = await prisma.eventCategory.update({
        where: { id },
        data: {
          ...(name !== undefined && { name }),
          ...(description !== undefined && { description }),
        },
      });

      res.status(200).json(updatedCategory);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update event category" });
    }
  }

  //delete an event category
  async deleteCategory(req: Request, res: Response): Promise<any> {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    try {
      const category = await prisma.eventCategory.findUnique({
        where: { id },
      });

      if (!category) {
        return res.status(404).json({ error: "Event category not found" });
      }

      await prisma.eventCategory.delete({
        where: { id },
      });

      res.status(200).json({ message: "Event category deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete event category" });
    }
  }
}
