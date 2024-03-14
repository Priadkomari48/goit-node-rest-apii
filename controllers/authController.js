import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Jimp from "jimp";
import fs from "fs/promises";
import path from "path";

import * as authServices from "../services/authServices.js";
import * as userServices from "../services/userServices.js";

import HttpError from "../helpers/HttpError.js";
import gravatar from "gravatar";
import "dotenv/config";

const { JWT_SECRET } = process.env;

const avatarsDir = path.resolve("public", "avatars");

const signup = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await userServices.findUser({ email });
    if (user) {
      throw HttpError(409, "Email already in use");
    }

    const avatarURL = gravatar.url(email);
    const newUser = await authServices.signup({ ...req.body, avatarURL });

    res.status(201).json({
      email: newUser.email,
      subscription: newUser.subscription,
    });
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userServices.findUser({ email });
    if (!user) {
      throw HttpError(401, "Email or password invalid"); // "Email invalid"
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw HttpError(401, "Email or password invalid"); // "Password invalid"
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await authServices.setToken(user._id, token);

    res.json({
      token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    next(error);
  }
};

const getCurrent = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;

    res.json({
      email,
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

const signout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await authServices.setToken(_id);

    res.json({
      message: "Signout success",
    });
  } catch (error) {
    next(error);
  }
};
const changeAvatar = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { path: oldPath, filename } = req.file;

    Jimp.read(oldPath, (err, lenna) => {
      if (err) throw err;
      lenna.resize(250, 250).write(`${avatarsDir}\\${filename}`);
      fs.rm(oldPath);
    });
    const avatarURL = path.join("avatars", filename);

    await authServices.setAvatar(_id, avatarURL);
    return res.json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

export default {
  signup,
  signin,
  getCurrent,
  signout,

  changeAvatar,
};
