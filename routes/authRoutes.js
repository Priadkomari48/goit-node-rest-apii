import express from "express";

import authController from "../controllers/authController.js";

import authtenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post("/signup", authController.signup);

authRouter.post("/signin", authController.signin);

authRouter.get("/current", authtenticate, authController.getCurrent);

authRouter.post("/signout", authtenticate, authController.signout);

authRouter.get("/verify/:verificationToken", authController.verify);

authRouter.post("/verify", authController.resendVerifyEmail);

authRouter.patch(
  "/users/avatars",
  upload.single("photo"),
  authtenticate,
  authController.changeAvatar
);

export default authRouter;
