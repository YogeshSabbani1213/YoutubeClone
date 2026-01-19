import express from 'express';
import { createChannel,createOwnChannel, getChannelById, getChannelVideos } from '../controllers/channelController.js';
import {verifyToken} from '../middleware/authMiddleware.js'

const router = express.Router()
router.post('/',verifyToken,createChannel)
router.post('/create',verifyToken,createOwnChannel)
router.get('/:id',getChannelById)
router.get('/:id/videos',getChannelVideos)

export default router;