import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
  channelName: String,
  description: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  subscribers: {
    type: Number,
    default: 0,
  },
  videos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video',
    },
  ]
}, { timestamps: true });

const channelModel = mongoose.model("Channel", channelSchema);
export default channelModel
