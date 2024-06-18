import express from "express";
import { get, merge } from "lodash";

import { getUserBySessionToken } from "../controllers/authController";

export const isOwner = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    console.log(id);
    const currentUserId = get(req, "identity._id") as string;
    console.log(currentUserId.toString());

    if (!currentUserId) {
      return res.status(403).json({
        code: 403,
        message: "Please login to continue",
      });
    }
    if (currentUserId.toString() !== id) {
      return res.status(403).json({
        code: 403,
        message: "You are not authorized",
      });
    }
    return next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["AUTH-COOKIE"];
    if (!sessionToken) {
      return res.status(403).json({
        code: 403,
        message: "Please login to continue",
      });
    }
    const existingUser = await getUserBySessionToken(sessionToken);
    if (!existingUser) {
      return res.status(403).json({
        code: 403,
        message: "Please login to continue",
      });
    }
    merge(req, { identity: existingUser });
    return next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};
