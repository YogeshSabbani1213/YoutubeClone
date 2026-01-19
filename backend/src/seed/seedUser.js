import dotenv from 'dotenv';
dotenv.config()
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import userModel from "../models/UserModel.js";
await mongoose.connect(process.env.MONGO_URI);

const users = [
  {
    username: "JohnDoe",
    email: "john@example.com",
    password: await bcrypt.hash("password123", 10)
  },
  {
    username: "JaneSmith",
    email: "jane@example.com",
    password: await bcrypt.hash("password123", 10)
  }
];

await userModel.deleteMany();
await userModel.insertMany(users);

console.log("Users seeded");
process.exit();
