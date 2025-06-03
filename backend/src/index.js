import app from "./app.js";
import dotenv from "dotenv";
dotenv.config(); 
import { createServer } from "http";
import connectDB from "./configs/connectDB.js";
import { intitSocketSever } from "./socket.js";


const server = createServer(app);
intitSocketSever(server);
const PORT = process.env.PORT || 3000;


connectDB();
  server.listen(PORT, () => {
  console.log(`Server is running on host http://localhost:${PORT}`);
});
  