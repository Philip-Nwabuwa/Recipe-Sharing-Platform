import express from "express";

import {
  getAllUsers,
  deleteUser,
  updateUser,
} from "../controllers/userControllers";
import { isAuthenticated, isOwner } from "../middleware";

export default (router: express.Router) => {
  router.get("/users", isAuthenticated, getAllUsers);
  router.delete("/users/:id", isAuthenticated, isOwner, deleteUser);
  router.post("/user/:id", isAuthenticated, isOwner, updateUser);
};
