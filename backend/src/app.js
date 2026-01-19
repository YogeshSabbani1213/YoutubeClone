import express from "express";
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import videoRoutes from "./routes/videoRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import channelRoutes from "./routes/channelRoutes.js"

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use('/api/channel',channelRoutes)
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);

export default app;
