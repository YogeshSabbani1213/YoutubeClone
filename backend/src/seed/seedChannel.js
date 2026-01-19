import dotenv from 'dotenv';
dotenv.config()
import mongoose from "mongoose";
import userModel from "../models/UserModel.js";
import channelModel from "../models/ChannelModel.js";

await mongoose.connect(process.env.MONGO_URI);

const users = await userModel.find();

await channelModel.deleteMany();

const channels = [
  {
    channelName: "Code with John",
    description: "Coding tutorials by John",
    owner: users[0]._id,
  },
  {
    channelName: "Tech with Jane",
    description: "Tech reviews and guides",
    owner: users[1]._id
  }
];

await channelModel.insertMany(channels);

console.log("Channels seeded");
process.exit();
