import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export class LocationDetailController {
  //create a location detail
  async addLocationDetail(req: Request, res: Response): Promise<any> {
    const { country, state, city } = req.body;

    if (!country || !state || !city) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const locationDetail = await prisma.locationDetail.create({
        data: { country, state, city },
      });

      res.status(201).json(locationDetail);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to add location detail" });
    }
  }

  //get a location detail by id
  async getLocationDetailById(req: Request, res: Response): Promise<any> {
    const locationDetailId = parseInt(req.params.id);

    try {
      const locationDetail = await prisma.locationDetail.findUnique({
        where: { id: locationDetailId },
      });

      if (!locationDetail) {
        return res.status(404).json({ error: "Location detail not found" });
      }

      res.json(locationDetail);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch location detail" });
    }
  }

  //get all location details
  async getAllLocationDetails(req: Request, res: Response): Promise<any> {
    try {
      const locationDetails = await prisma.locationDetail.findMany();
      res.json(locationDetails);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch location details" });
    }
  }

  //update location detail
  async updateLocationDetail(req: Request, res: Response): Promise<any> {
    const locationDetailId = parseInt(req.params.id);
    const { country, state, city } = req.body;

    try {
      const locationDetail = await prisma.locationDetail.findUnique({
        where: { id: locationDetailId },
      });

      if (!locationDetail) {
        return res.status(404).json({ error: "Location detail not found" });
      }

      const updatedLocationDetail = await prisma.locationDetail.update({
        where: { id: locationDetailId },
        data: {
          ...(country && { country }),
          ...(state && { state }),
          ...(city && { city }),
        },
      });

      res.json(updatedLocationDetail);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update location detail" });
    }
  }

  //delete location detail
  async deleteLocationDetail(req: Request, res: Response): Promise<any> {
    const locationDetailId = parseInt(req.params.id);

    try {
      const locationDetail = await prisma.locationDetail.findUnique({
        where: { id: locationDetailId },
      });

      if (!locationDetail) {
        return res.status(404).json({ error: "Location detail not found" });
      }

      await prisma.locationDetail.delete({
        where: { id: locationDetailId },
      });

      res.json({ message: "Location detail deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete location detail" });
    }
  }
}
