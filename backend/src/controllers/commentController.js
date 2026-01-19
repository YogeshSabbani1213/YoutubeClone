import commentModel from "../models/CommentModel.js";

export const getComments = async (req, res) => {
  try {
    const comments = await commentModel.find({ video: req.params.videoId })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });

    return res.status(201).json(comments)
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export async function addComments(req, res) {
  try {
    const { videoId, text } = req.body;
    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }
    const comment = await commentModel.create({
      video: videoId,
      text,
      user: req.user.id // from auth middleware
    })
    const populatedComment = await comment.populate(
      "user",
      "username avatar"
    );

    res.status(201).json(populatedComment);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function editComments(req, res) {
  if (!req.body.text || !req.body.text.trim()) {
    return res.status(400).json({ message: "Comment text required" });
  }
  const comment = await commentModel.findById(req.params.commentId);

  if (!comment)
    return res.status(404).json({ message: "Comment not found" });

  if (comment.user.toString() !== req.user.id)
    return res.status(403).json({ message: "Not allowed" });

  comment.text = req.body.text;
  await comment.save();

 const populated = await comment.populate("user", "username avatar");
  return res.status(201).json(populated);

}

export async function deleteComment(req, res) {
  const comment = await commentModel.findById(req.params.commentId);

  if (!comment)
    return res.status(404).json({ message: "Comment not found" });

  if (comment.user.toString() !== req.user.id)
    return res.status(403).json({ message: "Not allowed" });

  await comment.deleteOne();
  res.json({ message: "Comment deleted" });
}
