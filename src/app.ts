import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response, NextFunction, Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import responseHandler from "./utils/ResponseHandler";
import { UserRouter } from "./routers/userRouter";
import { EventRouter } from "./routers/eventRouter";
import { ReviewRouter } from "./routers/reviewRouter";
import { TicketRouter } from "./routers/ticketRouter";
import { PromotionRouter } from "./routers/promotionRouter";
import { EventCategoryRouter } from "./routers/eventCatRouter";
import { LocationDetailRouter } from "./routers/locationDetailRouter";
import { TransactionRouter } from "./routers/transactionRouter";
import { LocationRouter } from "./routers/locationRouter";

const PORT = process.env.PORT || 3232;

class App {
  readonly app: Application;

  constructor() {
    this.app = express();
    this.configure();
    this.setupMiddleware();
    this.routes();
    this.errorHandler();
  }

  private configure(): void {
    // this.app.use(cors());
    // this.app.use(express.json());
  }

  private setupMiddleware(): void {
    this.app.use(cors());
    this.app.use(bodyParser.json({ limit: "50mb" }));
    this.app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
    // this.app.use(express.json());
  }

  private routes(): void {
    const userRouter = new UserRouter();
    const eventRouter = new EventRouter();
    const reviewRouter = new ReviewRouter();
    const ticketRouter = new TicketRouter();
    const promotionRouter = new PromotionRouter();
    const eventCategoryRouter = new EventCategoryRouter();
    const locationDetailRouter = new LocationDetailRouter();
    const transactionRouter = new TransactionRouter();
    const locationRouter = new LocationRouter();
    this.app.get("/", (req: Request, res: Response): any => {
      return res.status(200).send("<h1>EVENT APPLICATION</h1>");
    });
    this.app.use("/user", userRouter.getRouter());
    this.app.use("/events", eventRouter.getRouter());
    this.app.use("/reviews", reviewRouter.getRouter());
    this.app.use("/tickets", ticketRouter.getRouter());
    this.app.use("/promotions", promotionRouter.getRouter());
    this.app.use("/event-categories", eventCategoryRouter.getRouter());
    this.app.use("/locations", locationDetailRouter.getRouter());
    this.app.use("/transactions", transactionRouter.getRouter());
    this.app.use("/location-details", locationRouter.getRouter());
  }

  private errorHandler(): void {
    this.app.use(
      (error: any, req: Request, res: Response, next: NextFunction) => {
        responseHandler.error(res, error.message, error.error, error.rc);
      }
    );
  }
  public start(): void {
    this.app.listen(PORT, () => {
      console.log("API RUNNING", PORT);
    });
  }
}

export default new App();
