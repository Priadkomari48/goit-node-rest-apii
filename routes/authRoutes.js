import express from "express";

import authController from "../controllers/authController.js";

import authtenticate from "../middlewares/authenticate.js";

const authRouter = express.Router();

authRouter.post("/signup", authController.signup);

authRouter.post("/signin", authController.signin);

authRouter.get("/current", authtenticate, authController.getCurrent);

authRouter.post("/signout", authtenticate, authController.signout);

export default authRouter;
