import { Request, Response } from "express";
import axios from "axios";
import { prisma } from "../config/prisma";
export class LocationController {
  async addLocationDetail(req: Request, res: Response): Promise<any> {
    const { province, city, district } = req.body;

    try {
      const locationDetail = await prisma.locationDetail.create({
        data: {
          province,
          city,
          district,
        },
      });

      res.status(201).json(locationDetail);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create location detail" });
    }
  }
}
