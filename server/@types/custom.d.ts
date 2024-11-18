import {Request} from "express";
import { IUser } from "../models/user.model";

declare global{
    namespace Express{
        interface Request{
            user?: IUser
        }

    }
};

// Module declaration for `express-rate-limit` (if types are not found)
declare module 'express-rate-limit' {
    import { RequestHandler } from 'express';

    interface RateLimitOptions {
        windowMs: number;
        limit: number;
        standardHeaders?: string;
        legacyHeaders?: boolean;
    }

    function rateLimit(options: RateLimitOptions): RequestHandler;

    export = rateLimit;
};

// Module declaration for `axios` (optional, if types are not found)
declare module 'axios' {
    import { AxiosInstance } from 'axios';
    const axios: AxiosInstance;
    export default axios;
};

// Module declaration for `socket.io` (optional, if types are not found)
declare module 'socket.io' {
    import { Server as SocketIOServer } from 'socket.io';
    export = Server;
};