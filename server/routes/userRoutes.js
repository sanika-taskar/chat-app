import express from "express";
import { checkAuth, login, signUp, updatedProfile } from "../controller/userController.js";
import { protectRoute } from "../middleware/auth.js";

const userRouter=express.Router();

userRouter.post("/signup",signUp);
userRouter.post("/login",login);
userRouter.put("/update-profile",protectRoute,updatedProfile);
userRouter.get("/check",protectRoute,checkAuth);

export default userRouter;