import videoModel from "../models/VideoModel.js";
import channelModel from "../models/ChannelModel.js";
export async function createVideo(req, res) {
  try {
    const { title, description, category, channelId, thumbnailUrl, videoUrl } = req.body;

    if (!title || !category || !channelId || !thumbnailUrl || !videoUrl) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const channel = await channelModel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not allowed to upload!" });
    }

    const newVideo = await videoModel.create({
      title,
      description,
      thumbnailUrl,
      videoUrl,
      channel: channel._id,
      uploader: req.user._id,
      category,
    });

    channel.videos.push(newVideo._id);
    await channel.save();

    return res.status(201).json({
      message: "Video added successfully (dummy data)",
      newVideo
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export const getAllVideos = async (req, res) => {
  const { search, category } = req.query;
  let filter = {};

  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }
  if (category) {
    filter.category = category;
  }

  const videos = await videoModel.find(filter)
    .populate("channel", "channelName")
    .populate("uploader", "username avatar")

  res.json(videos);
};

export const getVideoById = async (req, res) => {
  try {
    const video = await videoModel.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate("channel", "channelName")
      .populate("uploader", "username avatar");

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.json(video);
  } catch (error) {

    res.status(500).json({ error: error.message });
  }
};

export const likeVideo = async (req, res) => {
  try {
    const userId = req.user.id;
    const videoId = req.params.id;


    const video = await videoModel.findByIdAndUpdate(videoId,
      {
        $set: { likes: [userId], dislikes: [] }
      },
      { new: true }
    );
    if (!video) return res.status(404).json({ message: "Video not found" });

    res.json({
      likes: video.likes.length,
      dislikes: video.dislikes.length,
      userLiked: true,
      userDisliked: false
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const dislikeVideo = async (req, res) => {
  try {
    const userId = req.user.id;
    const videoId = req.params.id;

    const video = await videoModel.findByIdAndUpdate(
      videoId,
      {
        $addToSet: { dislikes: userId },
        $pull: { likes: userId }
      },
      { new: true }
    );
    if (!video) return res.status(404).json({ message: "Video not found" });

    res.json({
      likes: video.likes.length,
      dislikes: video.dislikes.length,
      userLiked: false,
      userDisliked: video.dislikes.includes(userId)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export async function createOwnVideo(req, res) {
  try {

    const { title, description, category, thumbnailUrl, videoUrl } = req.body;

    if (!title || !category || !thumbnailUrl || !videoUrl) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const channel = await channelModel.findOne({ owner: req.user._id });
    if (!channel) {
      return res.status(404).json({ message: "You don't have a channel to upload to!" });
    }


    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not allowed to upload to this channel!" });
    }

    const newVideo = await videoModel.create({
      title,
      description,
      thumbnailUrl,
      videoUrl,
      channel: channel._id,
      uploader: req.user._id,
      category,
    });

    // Update the channel's video array
    await channelModel.findByIdAndUpdate(channel._id, {
      $push: { videos: newVideo._id }
    });

    return res.status(201).json({
      message: "Video added successfully!",
      newVideo
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function deleteVideo(req, res) {
  try {
    const video = await videoModel.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });


    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await videoModel.findByIdAndDelete(req.params.id);


    await channelModel.findByIdAndUpdate(video.channel, {
      $pull: { videos: video._id }
    });

    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}