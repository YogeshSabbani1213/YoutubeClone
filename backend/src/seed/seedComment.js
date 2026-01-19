import dotenv from "dotenv";
import mongoose from "mongoose";
import commentModel from "../models/CommentModel.js";
import userModel from "../models/UserModel.js";
import videoModel from "../models/VideoModel.js";

dotenv.config();

const seedComments = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for comment seeding...");

    const users = await userModel.find();
    const videos = await videoModel.find();

    if (users.length === 0 || videos.length === 0) {
      console.log("Error: Seed users and videos first so we have IDs to link to.");
      process.exit(1);
    }

   
    await commentModel.deleteMany();

    const sampleTexts = [
      "Great explanation!", "Very helpful 👍", "Nice video",
      "This cleared my doubts", "Well explained", "Loved this content",
      "Thanks for sharing", "Good job 👏", "Simple and clear",
      "Awesome tutorial", "Really useful", "Nice pace",
      "Good examples", "Informative video", "Helpful for beginners"
    ];

    const comments = [];

    // Distribute comments across all 15 videos
    videos.forEach((video) => {
      for (let i = 0; i < 15; i++) {
        comments.push({
          text: sampleTexts[Math.floor(Math.random() * sampleTexts.length)],
          user: users[Math.floor(Math.random() * users.length)]._id, // Randomly picking a user
          video: video._id 
        });
      }
    });

    await commentModel.insertMany(comments);
    console.log(`Successfully added ${comments.length} comments (${videos.length} videos x 15 comments each)`);
    
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedComments();