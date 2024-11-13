import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncErrors";
import ErrorHandler from "../../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../../utils/redis";

// isAuthenticated middleware
export const isAuthenticated = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token;

    if (!access_token) {
      return next(new ErrorHandler("Please login to access this resource", 400));
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN as string) as JwtPayload;
    } catch (error) {
      return next(new ErrorHandler("Invalid access token", 400));
    }

    if (!decoded) {
      return next(new ErrorHandler("Access token is not valid", 400));
    }

    const user = await redis.get(decoded.id);

    if (!user) {
      return next(new ErrorHandler("Please login to access this resource", 400));
    }

    req.user = JSON.parse(user);

    // console.log("Authenticated User:", req.user);

    next();
  }
);

// authorizeRoles middleware
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ErrorHandler("User not authenticated", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`, 403));
    }

    console.log(`User with role: ${req.user.role} is authorized`); // Debugging log

    next();
  };
};

