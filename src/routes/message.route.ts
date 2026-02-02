import express from "express";
import { protectRoute } from "../middleware/auth.middleware.ts";
import { getUsersForSidebar, getMessages, sendMessage } from "../controllers/message.controller.ts";

const messageRoutes=express.Router();

messageRoutes.get("/users", protectRoute, getUsersForSidebar);
messageRoutes.get("/:id", protectRoute, getMessages);

messageRoutes.post("/send/:id", protectRoute, sendMessage);

export default messageRoutes;