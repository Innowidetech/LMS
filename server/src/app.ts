require("dotenv").config();
import express, { Request, Response, NextFunction } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./src/middleware/error";
import userRouter from "./src/routes/user.route";
import courseRouter from "./src/routes/course.route";
import orderRouter from "./src/routes/order.route";
import notificationRoute from "./src/routes/notification.route";
import analyticsRouter from "./src/routes/analytics.route";
import layoutRouter from "./src/routes/layout.route";
// import ErrorHandler from "./utils/ErrorHandler";


// Body parser
app.use(express.json({ limit: "50mb" }));

// Cookie parser
app.use(cookieParser());

// CORS => Cross-Origin Resource Sharing
app.use(
  cors({
    origin: ['http://localhost:3000/','https://lms-portal-0.web.app/'],
  })
);

//routes
app.use("/api/v1", userRouter,orderRouter,courseRouter,notificationRoute,analyticsRouter,layoutRouter);


// TESTING API
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

// Unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

app.use(ErrorMiddleware);
