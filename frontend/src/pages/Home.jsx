import React, { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";
import { useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";

function Home() {
  const { isSidebarOpen } = useOutletContext();
  const{searchText}=useOutletContext();
  console.log("searchText:", searchText);
  const [videos, setVideos] = useState([]);

  const [category, setCategory] = useState("All");
  useEffect(() => {
    async function fetchVideos() {
      try {
        const url =
          category === "All"
            ? "https://youtubeclone-1-k34c.onrender.com/api/videos"
            : `https://youtubeclone-1-k34c.onrender.com/api/videos?category=${category}`;
        const response = await fetch(url);
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchVideos();
  }, [category]);

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchText.toLowerCase())
  );
  //    console.log("Home rendered");

  return (
    <div>
      {/*Categories */}
      <div className=" lg:mt-4 px-2 sm:px-4 flex gap-2 sm:gap-3 mb-3 overflow-x-auto scrollbar-hide">
        {["All", "Education", "Programming", "Sports"].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1 md:text-md lg:text-xl rounded ${
              category === cat ? "bg-black text-white" : "bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/*Videos on home*/}
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${isSidebarOpen ? "lg:grid-cols-3" : "lg:grid-cols-4"} gap-4 px-2 sm:px-4 transition-all` } >
        {filteredVideos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
}

export default Home;
