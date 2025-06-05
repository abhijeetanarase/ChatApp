import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Message from "./models/message.js";
import Contact from "./models/contact.js";


let io;
const onlineUsers = new Map();

const intitSocketSever = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    const token = socket?.handshake?.auth?.token;
    if (!token) {
      socket.disconnect();
      return;
    }

    try {
      const decoded = jwt.verify(
        token?.split(" ")[1] ?? token,
        process.env.JWT_SECRET
      );
      console.log(decoded);
      
      const userId = decoded.id;
    
      

      onlineUsers.set(userId, socket.id);

      // 🔑 Properly attach socket listeners here:
      socket.on("join_group", (groupName) => {
        console.log(`User ${userId} joined group ${groupName}`);
        socket.join(groupName);
        const room = io.sockets.adapter.rooms.get("room123");
        console.log("room hai bhai", room);
      });

      socket.on("chat", (message) => {
        console.log(`User ${userId} says:`, message);
        io.to("room123").emit("chat", message);
      });

       socket.broadcast.emit("user_online", userId);

      
      socket.on("typing" ,({toUserId , typing})=>{
        console.log(typing , toUserId);
        
      })

      socket.on("private_chat",async ({ toUserId, message }) => {
         const created =  await Message.create({
          sender : userId,
          receiver : toUserId,
          content : message
         })
       
         
        sendPrivateMessage({
          userId: toUserId,
          created,
          from: userId,
        });
      });

      const keysArray = Array.from(onlineUsers.keys());
      console.log("keys",keysArray);
      
      

      socket.on("disconnect", () => {
        if (onlineUsers.get(userId) === socket.id) {
          onlineUsers.delete(userId);
          socket.broadcast.emit("user_offline", userId);
         }
        
        
      });
    } catch (err) {
      console.error("JWT error:", err.message);
      socket.disconnect();
    }
  });
};

// Send a private message to a user
const sendPrivateMessage = ({ userId, created, from }) => {
  const socketId = onlineUsers.get(userId);

  
  if (socketId) {
    io.to(socketId).emit("private_message", {
      from,
      message: created,
    });
  } else {
    console.log(`User ${userId} is offline or not connected`);
  }
};


const isTypingOrNot = ({userId , from , typing }) =>{
  const socketId = onlineUsers.get(userId);
  if (socketId) {
    io.to(socketId).emit("typing" , typing);
  } else {
    console.log("user is offline");
    
  }
}

export { intitSocketSever };
