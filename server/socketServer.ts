import { Server as SocketIOServer } from "socket.io";
import http from "http";

export const initSocketServer = (server: http.Server)=>{
    const io = new SocketIOServer(server);

    io.on("connection",(socket:any)=>{
        console.log("User connected");

        socket.on("notification",(data:any)=>{
            io.emit("newNotification",data);
        });

        socket.on("disconnect",()=>{
            console.log("User disconnected");
        });
    });
};