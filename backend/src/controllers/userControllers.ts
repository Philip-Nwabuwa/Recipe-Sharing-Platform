import express from "express";

import { deleteUserById, getUserById, getUsers } from "./authController";

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getUsers();
    return res.status(200).json({
      code: 200,
      data: users,
      message: "All users",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    console.log(id);

    const deletedUser = await deleteUserById(id);
    return res.status(200).json({
      code: 200,
      data: deletedUser,
      message: "User deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    if (!id || !username) {
      return res.status(400).json({
        code: 400,
        message: "Id / username is required",
      });
    }
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({
        code: 404,
        message: "User not found",
      });
    }
    user.username = username;
    const updatedUser = await user.save();
    return res.status(200).json({
      code: 200,
      data: updatedUser,
      message: "User updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};
