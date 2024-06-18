import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.SECRET) {
  console.error("Fatal Error: SECRET not defined");
  process.exit(1);
}

export const random = () => crypto.randomBytes(128).toString("base64");

export const authentication = (salt: string, password: string) => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(process.env.SECRET)
    .digest("hex");
};
