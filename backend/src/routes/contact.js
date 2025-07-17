import express from "express"
import { getAllContacts, addToConatct, searchUsers , getProfile , checkAuth, getPendingInvitations, respondToInvitation } from "../controllers/contact.js";

const router = express.Router();

router.post("/:id" , addToConatct);
router.get("/" , getAllContacts);
router.get("/users" ,searchUsers )
router.get('/profile' , getProfile )
router.get('/check-auth' , checkAuth);
router.get("/invitations", getPendingInvitations);
router.post("/invitation/:contactId/respond", respondToInvitation);


export default router;