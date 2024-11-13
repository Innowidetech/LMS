import { app } from "./app";
import {v2 as cloudinary} from "cloudinary";
import connectDB from "./utils/db";
require("dotenv").config();

// const server = http.createServer(app);

// cloudinary config
cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.CLOUD_API_KEY,
  api_secret:process.env.CLOUD_SECRET_KEY,
});

// initSocketServer(server);

// create server
const port=5000;
app.listen(port, () => {
  console.log(`Server is connected with port ${port}`);
  connectDB();
});


