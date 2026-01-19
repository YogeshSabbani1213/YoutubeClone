import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  createVideo,
  getAllVideos,
  getVideoById,
  likeVideo,
  dislikeVideo,
  createOwnVideo,
  deleteVideo
} from "../controllers/videoController.js"

const router = express.Router();

router.post("/", verifyToken, createVideo);
router.post("/createOwnVideo", verifyToken, createOwnVideo);
router.get("/", getAllVideos);
router.get("/:id", getVideoById);
router.put("/:id/like", verifyToken, likeVideo);
router.put("/:id/dislike", verifyToken, dislikeVideo);
router.delete('/:id', verifyToken, deleteVideo);


export default router;
