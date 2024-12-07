import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response, NextFunction, Application } from "express";
import cors from "cors";
import responseHandler from "./utils/ResponseHandler";
import { UserRouter } from "./routers/userRouter";

const PORT = process.env.PORT || 8080;

class App {
  readonly app: Application;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.errorHandler();
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private routes(): void {
    const userRouter = new UserRouter();
    this.app.get("/", (req: Request, res: Response): any => {
      return res.status(200).send("<h1>EVENT APPLICATION</h1>");
    });
    this.app.use("/user", userRouter.getRouter());
  }

  private errorHandler(): void {
    (error: any, req: Request, res: Response, next: NextFunction) => {
      responseHandler.error(res, error.message, error.error, error.rc);
    };
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log("API RUNNING", PORT);
    });
  }
}

export default new App();
