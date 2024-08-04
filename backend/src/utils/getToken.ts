import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { UserModel } from "../interfaces";

dotenv.config({
  path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env",
});
// loading .env file

const JWT_SECRET: string = process.env.JWT_SECRET || "";

export const getToken = (user: UserModel) =>
  jsonwebtoken.sign(
    { user: { id: user.id, username: user.username } },
    JWT_SECRET,
    { expiresIn: "1d" }
  );
