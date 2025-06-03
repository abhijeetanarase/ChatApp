import { Router } from "express";
import { getMessages } from "../controllers/message.js";

const router = Router();

router.get("/:id", getMessages);

export default router;
