import express from "express";
import userRouter from "./routes/user.js";
import contactRouter from "./routes/contact.js"
import messageRouter  from "./routes/message.js"
import cors from "cors"
import authenticate from "./middlewares/auth.js";



const app = express();

app.use(express.json());
const corsOptions = {
  origin: process.env.FRONTEND_URL, // frontend URL (React/Vite)
  credentials: true, // allows cookies / authorization headers
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use("/api/user", userRouter);
app.use("/api/contact",authenticate , contactRouter)
app.use("/api/message" ,  authenticate , messageRouter);

export default app;
