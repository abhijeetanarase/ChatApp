import express from "express"
import { addToConatct, getAllContacts, getProfile, searchUsers } from "../controllers/contact.js";

const router = express.Router();

router.post("/:id" , addToConatct);
router.get("/" , getAllContacts);
router.get("/users" ,searchUsers )
router.get('/profile' , getProfile )



export default router;