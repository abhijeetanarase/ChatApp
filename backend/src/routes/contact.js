import express from "express"
import { addToConatct, checkAuth, getAllContacts, getProfile, searchUsers } from "../controllers/contact.js";

const router = express.Router();

router.post("/:id" , addToConatct);
router.get("/" , getAllContacts);
router.get("/users" ,searchUsers )
router.get('/profile' , getProfile )
router.get('/check-auth' , checkAuth);



export default router;