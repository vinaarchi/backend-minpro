// import { Request, Response } from "express";
// import { isDiscountCouponValid } from "../services/discount.service";

// export class DiscountController {
//   async getDiscount(req: Request, res: Response): Promise<any> {
//     try {
//       const { discountCode, userId } = req.body;
//       console.log("INI MANGGIL REQ BODY", { body: req.body });

//       const isValid = await isDiscountCouponValid(discountCode, userId);
//       console.log(" INI DARI BACKEND", isValid);
//       console.log("INI MANGGIL DISC DAN USER", { discountCode, userId });

//       if (isValid) {
//         return res.status(200).json({
//           message: "Discount code is valid",
//           discount: 10,
//         });
//       } else {
//         return res.status(400).json({
//           message: "Discount code is invalid or expired",
//         });
//       }
//     } catch (error) {
//       console.log(error);
//       return res.status(500).json({ message: "Validation failed", error });
//     }
//   }
// }
