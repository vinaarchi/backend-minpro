"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const ResponseHandler_1 = __importDefault(require("./utils/ResponseHandler"));
const userRouter_1 = require("./routers/userRouter");
const eventRouter_1 = require("./routers/eventRouter");
const reviewRouter_1 = require("./routers/reviewRouter");
const ticketRouter_1 = require("./routers/ticketRouter");
const promotionRouter_1 = require("./routers/promotionRouter");
const eventCatRouter_1 = require("./routers/eventCatRouter");
const locationDetailRouter_1 = require("./routers/locationDetailRouter");
const transactionRouter_1 = require("./routers/transactionRouter");
const locationRouter_1 = require("./routers/locationRouter");
// import { DiscountRouter } from "./routers/discountRouter";
const PORT = process.env.PORT || 3232;
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.configure();
        this.setupMiddleware();
        this.routes();
        this.errorHandler();
    }
    configure() {
        // this.app.use(cors());
        // this.app.use(express.json());
    }
    setupMiddleware() {
        this.app.use((0, cors_1.default)());
        this.app.use(body_parser_1.default.json({ limit: "50mb" }));
        this.app.use(body_parser_1.default.urlencoded({ limit: "50mb", extended: true }));
        // this.app.use(express.json());
    }
    routes() {
        const userRouter = new userRouter_1.UserRouter();
        const eventRouter = new eventRouter_1.EventRouter();
        const reviewRouter = new reviewRouter_1.ReviewRouter();
        const ticketRouter = new ticketRouter_1.TicketRouter();
        const promotionRouter = new promotionRouter_1.PromotionRouter();
        const eventCategoryRouter = new eventCatRouter_1.EventCategoryRouter();
        const locationDetailRouter = new locationDetailRouter_1.LocationDetailRouter();
        const transactionRouter = new transactionRouter_1.TransactionRouter();
        const locationRouter = new locationRouter_1.LocationRouter();
        // const discountRouter = new DiscountRouter();
        this.app.get("/", (req, res) => {
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
        // this.app.use("/discount", discountRouter.getRouter());
    }
    errorHandler() {
        this.app.use((error, req, res, next) => {
            ResponseHandler_1.default.error(res, error.message, error.error, error.rc);
        });
    }
    start() {
        this.app.listen(PORT, () => {
            console.log("API RUNNING", PORT);
        });
    }
}
exports.default = new App();
