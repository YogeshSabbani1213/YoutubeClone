import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { addComments, deleteComment, editComments, getComments } from "../controllers/commentController.js";

const router = express.Router();

router.get("/:videoId", getComments);
router.post('/:videoId',verifyToken,addComments)

router.put("/:commentId",verifyToken,editComments);
router.delete('/:commentId',verifyToken,deleteComment)

export default router;
