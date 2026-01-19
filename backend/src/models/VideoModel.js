import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  thumbnailUrl: String,
  videoUrl: String,
  category: String,
  views: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
  
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" }
}, { timestamps: true });

const videoModel = mongoose.model("Video", videoSchema);
export default videoModel
