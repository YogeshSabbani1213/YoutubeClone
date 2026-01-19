import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: String,
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video"
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

const commentModel = mongoose.model("Comment", commentSchema);
export default commentModel;
