import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { getUserForSidebar ,getAllMessages, markMessageAsSeen, sendMessage} from "../controller/messageController.js";

const messageRouter=express.Router();

messageRouter.get("/users",protectRoute,getUserForSidebar);
messageRouter.get("/:id",protectRoute,getAllMessages);
messageRouter.put("/marks/:id",protectRoute,markMessageAsSeen);
messageRouter.post("/send/:id",protectRoute,sendMessage);

export default messageRouter;