"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const cloudinary_1 = require("cloudinary");
const db_1 = __importDefault(require("./utils/db"));
require("dotenv").config();
// const server = http.createServer(app);
// cloudinary config
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY,
});
// initSocketServer(server);
// create server
const port = 5000;
app_1.app.listen(port, () => {
    console.log(`Server is connected with port ${port}`);
    (0, db_1.default)();
});
