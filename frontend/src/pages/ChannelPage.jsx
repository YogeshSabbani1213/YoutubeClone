import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../context/AuthContext';
import UploadVideoModal from '../components/UploadVideoModal';
import VideoCard from '../components/VideoCard';

function ChannelPage() {
    const { id } = useParams();
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [channel, setChannel] = useState(null);
    const [videos, setVideos] = useState([]);
    const [err, setErr] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setErr(null);

            // Fetch Channel Info 
            const response = await axios.get(`https://youtubeclone-1-k34c.onrender.com/api/channel/${id}`);

            //  Extract data from the response
            const channelData = response.data.channel;

            setChannel(channelData);
            setVideos(channelData.videos || []);

        } catch (error) {
            console.error('Fetch Error:', error);
            setErr(error.response?.data?.message || "Error loading channel data");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Ownership Check
    const isOwner = user && channel && user._id === (channel.owner?._id || channel.owner);

    if (loading) return (
        <div className="flex justify-center items-center h-screen text-xl font-semibold">
            Loading Channel...
        </div>
    );

    if (err) return (
        <div className="text-center mt-20 text-red-500 font-bold">{err}</div>
    );

    if (!channel) return (
        <div className="text-center mt-20">Channel not found.</div>
    );

    return (
        <div className="bg-white min-h-screen pb-20 mt-12">
            {/* CHANNEL BANNER */}
            <div className="w-full h-40 sm:h-56 md:h-72 bg-slate-200">
                {channel.channelBanner ? (
                    <img src={channel.channelBanner} alt="Banner" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full  from-gray-300 to-gray-400" />
                )}
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* CHANNEL INFO SECTION */}
                <div className="flex flex-col md:flex-row items-center md:items-start -mt-12 md:-mt-16 mb-8 gap-6">
                    <img
                        src={channel.owner?.avatar || `https://ui-avatars.com/api/?name=${channel.channelName}`}
                        alt="Profile"
                        className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full"
                    />

                    <div className="flex-1 text-center md:text-left md:mt-16">
                        <h1 className="text-3xl font-bold text-gray-900">{channel.channelName}</h1>
                        <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600 text-sm mt-1">
                            <span className="font-medium">@{channel.owner?.username || 'user'}</span>
                            <span>•</span>
                            <span>{channel.subscribers || 0} subscribers</span>
                        </div>
                        <p className="mt-3 text-gray-700 max-w-3xl line-clamp-2 italic">
                            {channel.description || "No description available."}
                        </p>

                        <div className="mt-4 flex gap-3 justify-center md:justify-start">
                            {isOwner ? (
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-blue-600 text-white px-8 py-2 rounded-full font-semibold hover:bg-blue-700 transition"
                                >
                                    Upload Video
                                </button>
                            ) : (
                                <button className="bg-black text-white px-8 py-2 rounded-full font-bold hover:bg-zinc-800 transition">
                                    Subscribe
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* TABS */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="flex space-x-8">
                        <button className="lg:text-md border-b-2 border-black pb-4 text-sm font-bold uppercase">Videos</button>
                        <button className="lg:text-md text-gray-500 pb-4 text-sm font-medium uppercase hover:text-black">About</button>
                    </nav>
                </div>

                {/* VIDEO GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {videos && videos.length > 0 ? (
                        videos.map((video) => (
                            <VideoCard key={video._id} video={video} isOwner={isOwner} 
                                refreshVideos={fetchData} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-gray-500">
                            This channel has no videos yet.
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL */}
            {isModalOpen && (
                <UploadVideoModal
                    channelId={id}
                    setOpen={setIsModalOpen}
                    refreshVideos={fetchData}
                />
            )}
        </div>
    );
}

export default ChannelPage;