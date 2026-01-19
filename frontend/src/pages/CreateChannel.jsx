import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CreateChannel = () => {
    const [channelName, setChannelName] = useState('');
    const [description, setDescription] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('https://youtubeclone-1-k34c.onrender.com/api/channel/create', {
                channelName,
                description,
                owner: user._id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });


            const newChannelId = res.data.newChannel._id;


            const updatedUser = {
                ...user,
                channels: user.channels ? [...user.channels, newChannelId] : [newChannelId]
            };
            localStorage.setItem("user", JSON.stringify(updatedUser));

            toast.success("Channel Created Successfully!", {
                style: { fontSize: "20px", borderRadius: '10px', background: '#333', color: '#fff' }
            });
            navigate(`/channel/${newChannelId}`);
            window.location.reload();

        } catch (err) {
            toast.error(err.response?.data?.message || "Error creating channel");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl border w-full max-w-md">
                <h1 className="lg:text-3xl text-2xl font-bold mb-6 text-center">Setup Your Channel</h1>
                <form onSubmit={handleCreate} className="flex flex-col gap-4">
                    <div>
                        <label className="lg:text-lg text-sm font-semibold text-gray-600">Channel Name</label>
                        <input
                            type="text" required
                            className="lg:text-lg w-full border p-2 rounded-lg mt-1 outline-blue-500"
                            value={channelName}
                            onChange={(e) => setChannelName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="lg:text-lg text-sm font-semibold text-gray-600">Description</label>
                        <textarea
                            required rows="4"
                            className="lg:text-lg w-full border p-2 rounded-lg mt-1 outline-blue-500"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>
                    <button type="submit" className="lg:text-lg bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                        Finish Creation
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateChannel;