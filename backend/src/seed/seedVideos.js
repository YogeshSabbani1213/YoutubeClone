import dotenv from 'dotenv';
dotenv.config();
import mongoose from "mongoose";
import videoModel from '../models/VideoModel.js';
import userModel from "../models/UserModel.js";
import channelModel from "../models/ChannelModel.js";

await mongoose.connect(process.env.MONGO_URI);

const users = await userModel.find();
const channels = await channelModel.find();


if (channels.length < 2) {
    console.log("Please seed channels first!");
    process.exit();
}

await videoModel.deleteMany();

const videos = [
  {
    title: "Learn React in 30 Minutes",
    description: "Quick React tutorial",
    thumbnailUrl: "https://picsum.photos/400/225?random=1",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    category: "Education",
    uploader: users[0]._id, 
    channel: channels[0]._id,
    likes: [], 
    dislikes: []
  },
  {
    title: "Node.js Crash Course",
    description: "Node basics explained",
    thumbnailUrl: "https://picsum.photos/400/225?random=2",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    category: "Programming",
    uploader: users[1]._id,
    channel: channels[1]._id,
    likes: [],
    dislikes: []
  }
];

// Create exactly 15 videos
const finalVideos = [];
for (let i = 0; i < 15; i++) {
  const base = videos[i % 2];
  finalVideos.push({
    ...base,
    title: `${base.title} Part ${i + 1}`,

    views: Math.floor(Math.random() * 20000) + 500 
  });
}

await videoModel.insertMany(finalVideos);

console.log("15 Videos seeded successfully with randomized views");
process.exit();