import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const UploadVideoModal = ({ channelId, setOpen, refreshVideos }) => {
    const [videoData, setVideoData] = useState({
        title: "",
        description: "",
        thumbnailUrl: "",
        videoUrl: "",
        category: "Tech"
    });

    const handleUpload = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8080/api/videos/createOwnVideo', {
                ...videoData,

            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast("Video Uploaded Successfully!", {
                style: { fontSize: "20px", borderRadius: '10px', background: '#333', color: '#fff' }
            });
            setOpen(false); // Close modal
            if (refreshVideos) {
                refreshVideos();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Upload failed");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-100">
            <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Upload Video</h2>
                    <button onClick={() => setOpen(false)} className="text-gray-500 text-2xl">✕</button>
                </div>
                <form onSubmit={handleUpload} className="flex flex-col gap-4">
                    <input type="text" placeholder="Title" className="border p-2 rounded-lg" required
                        onChange={e => setVideoData({ ...videoData, title: e.target.value })} />

                    <textarea placeholder="Description" className="border p-2 rounded-lg h-24"
                        onChange={e => setVideoData({ ...videoData, description: e.target.value })} />

                    <input type="text" placeholder="Thumbnail URL" className="border p-2 rounded-lg" required
                        onChange={e => setVideoData({ ...videoData, thumbnailUrl: e.target.value })} />

                    <input type="text" placeholder="Video URL (mp4)" className="border p-2 rounded-lg" required
                        onChange={e => setVideoData({ ...videoData, videoUrl: e.target.value })} />

                    <select className="border p-2 rounded-lg" onChange={e => setVideoData({ ...videoData, category: e.target.value })}>
                        <option value="Tech">Tech</option>
                        <option value="Sports">Sports</option>
                        <option value="Politics">Politics</option>
                        <option value="Education">Education</option>
                        <option value="Entertainment">Entertainment</option>
                    </select>

                    <button type="submit" className="bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition">
                        Publish Video
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UploadVideoModal;