import express from "express"
import { addToConatct, getAllContacts, searchUsers } from "../controllers/contact.js";

const router = express.Router();

router.post("/:id" , addToConatct);
router.get("/" , getAllContacts);
router.get("/users" ,searchUsers )



export default router;