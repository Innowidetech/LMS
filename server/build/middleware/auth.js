"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.isAuthenticated = void 0;
const catchAsyncErrors_1 = require("./catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = require("../utils/redis");
// isAuthenticated middleware
exports.isAuthenticated = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    const access_token = req.cookies.access_token;
    if (!access_token) {
        return next(new ErrorHandler_1.default("Please login to access this resource", 400));
    }
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(access_token, process.env.ACCESS_TOKEN);
    }
    catch (error) {
        return next(new ErrorHandler_1.default("Invalid access token", 400));
    }
    if (!decoded) {
        return next(new ErrorHandler_1.default("Access token is not valid", 400));
    }
    const user = await redis_1.redis.get(decoded.id);
    if (!user) {
        return next(new ErrorHandler_1.default("Please login to access this resource", 400));
    }
    req.user = JSON.parse(user);
    next();
});
// authorizeRoles middleware
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ErrorHandler_1.default("User not authenticated", 401));
        }
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler_1.default(`Role: ${req.user.role} is not allowed to access this resource`, 403));
        }
        console.log(`User with role: ${req.user.role} is authorized`); // Debugging log
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
