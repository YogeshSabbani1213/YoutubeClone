import React, { useState, useEffect, useRef } from "react"; 
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import toast from "react-hot-toast";

function VideoCard({ video, isOwner, refreshVideos }) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null); 

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async (e) => {
    e.stopPropagation(); 
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8080/api/videos/${video._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.error("Video deleted", {
          style: { fontSize: "20px", borderRadius: '10px', background: '#333', color: '#fff' }
        });
        refreshVideos();
        setShowMenu(false);
      } catch (err) {
        toast.error("Failed to delete video", {
          style: { fontSize: "20px", borderRadius: '10px', background: '#333', color: '#fff' }
        });
      }
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation(); 
    toast("Edit functionality Coming soon", {
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      }
    })
    setShowMenu(false);
  };

  return (
    <div className="w-full relative "> 
      <div className="cursor-pointer  w-full" onClick={() => navigate(`/videos/${video._id}`)}>
        {/*thumbnail*/}
        <img
          src={video.thumbnailUrl}
          alt="thumbnail"
          className="w-full aspect-video rounded-xl object-cover" 
          loading="lazy"
        />
        {/*info*/}
        <div className="flex gap-3 mt-2 relative">
          <img
            src={video.uploader?.avatar || `https://ui-avatars.com/api/?name=${video.title}`}
            alt=""
            className="w-10  ml-1 rounded-full object-cover h-10"
          />
          <div className="flex flex-col flex-1">
            <h1 className="font-semibold text-md sm:text-base md:text-md lg:text-xl md:line-clamp-1  lg:line-clamp-1 line-clamp-2">{video.title}</h1>
            <span className="text-gray-700 text-sm md:text-md  lg:text-lg ">{video.channel?.channelName}</span>
            <span className="text-gray-700 text-sm  md:text-md lg:text-lg"> {video.views} views • {video.category}</span>
          </div>

          
          {isOwner && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Stop navigation
                  setShowMenu(!showMenu);
                }}
                className="p-1 hover:bg-gray-100 rounded-full h-8 w-8 flex items-center justify-center font-bold text-xl"
              >
                ⋮
              </button>

              {showMenu && (
                <div className="absolute right-0 top-8 w-32 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1">
                  <button
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                    onClick={handleEdit}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                    onClick={handleDelete}
                  >
                    🗑️ Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoCard;