import channelModel from "../models/ChannelModel.js";
import userModel from "../models/UserModel.js";
import videoModel from "../models/VideoModel.js";

export async function createChannel(req, res) {
    try {
        const { channelName, description, channelBanner } = req.body;
        const userId = req.user._id;

        // 1. Check if the user ALREADY owns a channel
        const existingChannel = await channelModel.findOne({ owner: userId });
        if (existingChannel) {
            return res.status(400).json({ message: 'You can only create one channel per account.' });
        }

        // 2. Check if the name is taken
        const nameTaken = await channelModel.findOne({ channelName });
        if (nameTaken) {
            return res.status(400).json({ message: 'Channel name already exists.' });
        }

        const newChannel = await channelModel.create({
            channelName,
            owner: userId,
            description,
            channelBanner,
            subscribers: 0,
            videos: [],
        });

        // 3. Update User model 
        await userModel.findByIdAndUpdate(userId, {
            $set: { channelId: newChannel._id }
        }).exec();

        return res.status(201).json({ message: 'Channel Creation Successful', newChannel });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function getChannelById(req, res) {
    try {

        const { id } = req.params;
        const channel = await channelModel.findById(id)
            .populate('videos')
            .populate("owner", "username avatar")

        if (!channel) {
            return res.status(404).json({ message: 'Channel is not found' });
        }
        return res.status(200).json({ channel });
    }
    catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

export async function getChannelVideos(req, res) {
    try {
        const { channelId } = req.params;
        const videos = await videoModel.find({ channel: channelId })
            .populate("channel", "channelName")
            .sort({ createdAt: -1 })

        return res.status(200).json({ videos })
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function createOwnChannel(req, res) {
    try {
        const { channelName, description, channelBanner } = req.body;
        const userId = req.user._id;
        console.log("userid", userId);


        // 1. Check if the user ALREADY owns a channel
        const existingChannel = await channelModel.findOne({ owner: userId });
        if (existingChannel) {
            return res.status(400).json({ message: 'You can only create one channel per account.' });
        }

        // 2. Check if the name is taken
        const nameTaken = await channelModel.findOne({ channelName });
        if (nameTaken) {
            return res.status(400).json({ message: 'Channel name already exists.' });
        }

        const newChannel = await channelModel.create({
            channelName,
            owner: userId,
            description,
            channelBanner,
            subscribers: 0,
            videos: [],
        });

        // 3. Update User model 
        await userModel.findByIdAndUpdate(req.user._id, {
            $push: { channels: newChannel._id }
        }, { new: true });

        return res.status(201).json({ message: 'Channel Creation Successful', newChannel });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}