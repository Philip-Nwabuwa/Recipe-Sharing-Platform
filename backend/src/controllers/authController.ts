import express from "express";
import { UserModel } from "../models/users";
import { authentication, random } from "../helpers/index";

export const getUsers = () => UserModel.find();
export const getUsersByEmail = (email: string) => UserModel.findOne({ email });
export const getUsersByUsername = (username: string) =>
  UserModel.findOne({ username });
export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({
    "authentication.sessionToken": sessionToken,
  });
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());
export const deleteUserById = (id: string) =>
  UserModel.findByIdAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values);

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        code: 400,
        message: "Please provide username, email and password",
      });
    }
    const existingUser = await getUsersByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        code: 400,
        message: "Email already exists",
      });
    }
    const existingUserByUsername = await getUsersByUsername(username);
    if (existingUserByUsername) {
      return res.status(400).json({
        code: 400,
        message: "Username already exists",
      });
    }
    const salt = random();
    const user = await createUser({
      username,
      email: email.toLowerCase(),
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });
    return res.status(200).json({
      code: 200,
      data: user,
      message: "Signup successful",
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        code: 400,
        message: "Please provide email and password",
      });
    }
    const user = await getUsersByEmail(email).select(
      "+authentication.salt +authentication.password"
    );
    if (!user) {
      return res.status(400).json({
        code: 400,
        message: "Please provide email and password",
      });
    }

    const expectedHash = authentication(user.authentication.salt, password);
    if (user.authentication.password !== expectedHash) {
      return res.status(400).json({
        code: 400,
        message: "Please provide email and password",
      });
    }
    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );
    await user.save();
    res.cookie("AUTH-COOKIE", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });
    return res.status(200).json({
      code: 200,
      data: user,
      message: "Login successful",
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
