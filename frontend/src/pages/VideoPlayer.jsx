import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { timeAgo } from "../utils/TimeAgo.js";
import { faTelegram } from "@fortawesome/free-brands-svg-icons";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faThumbsDown,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";

function VideoPlayer() {
  const { user } = useAuth();
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [likess, setLikess] = useState(0);
  const [disLikes, setDisLikes] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    async function fetchVideo() {
      try {
        const response = await fetch(`https://youtubeclone-1-k34c.onrender.com/api/videos/${id}`);
        if (!response.ok) throw new Error("Video not found");
        const data = await response.json();
        setVideo(data);
        setLikess(data.likes?.length || 0);
        setDisLikes(data.disLikes?.length || 0);
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    }
    async function fetchAllVideos() {
      try {
        const response = await fetch(`https://youtubeclone-1-k34c.onrender.com/api/videos`); 
        const data = await response.json();
        
        setRecommendations(data.filter(v => v._id !== id));
      } catch (err) { console.error(err); }
    }
    fetchAllVideos();
    fetchVideo();
    async function fetchComments() {
      const response = await fetch(`https://youtubeclone-1-k34c.onrender.com/api/comments/${id}`);
      const data = await response.json();
      setComments(data);
    }
    fetchComments();
  }, [id]);

  {/*adding comments */ }
  async function addComment() {
    if (!user) {
      toast.error("Please login to comment", {
        style: { fontSize:"20px" ,borderRadius: '10px', background: '#333', color: '#fff' }
      });
      return;
    }
    const loadingToast = toast.loading("Posting comment...");
    const res = await fetch(`https://youtubeclone-1-k34c.onrender.com/api/comments/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        videoId: id,
        text,
      }),
    });
    const newComment = await res.json();
    setComments([newComment, ...comments]);
    setText("");
    toast.success("Comment Added",{style: { id: loadingToast }})
  }

  {
    /*editing comments */
  }
  function editComment(commentId) {
    const newText = prompt("Edit comment");

    if (!newText || !newText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    fetch(`https://youtubeclone-1-k34c.onrender.com/api/comments/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ text: newText }),
    })
      .then((res) => res.json())
      .then((updated) => {
        setComments(comments.map((c) => (c._id === commentId ? updated : c)));
      });
  }

  {
    /*deleting comments */
  }

  function deleteComment(commentId) {
    if (!window.confirm("Delete this comment?")) return;

    fetch(`https://youtubeclone-1-k34c.onrender.com/api/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(() => {
      setComments(comments.filter((c) => c._id !== commentId));
    });
  }


  //likes
  async function handleLike() {
    if (!user) return toast.error("Login to like");

    const res = await fetch(`https://youtubeclone-1-k34c.onrender.com/api/videos/${id}/like`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();
    setLikess(data.likes);
    setDisLikes(data.dislikes);
    setUserLiked(data.userLiked);
    setUserDisliked(data.userDisliked);
  }

  async function handleDislike() {
    if (!user) return toast.error("Login to dislike");

    const res = await fetch(`https://youtubeclone-1-k34c.onrender.com/api/videos/${id}/dislike`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();
    setLikess(data.likes);
    setDisLikes(data.dislikes);
    setUserLiked(data.userLiked);
    setUserDisliked(data.userDisliked);
  }

  if (!video) {
    return <p className="p-10 text-center">loading....</p>;
  }
  return (
    <div className=" flex flex-col lg:flex-row gap-6 px-2 lg:px-4 lg:py-6 lg:max-w-10xl lg:mx-10 ">
      <div className="lg:flex-1 lg:max-w-[calc(100%-100px)]">
        {/* Video */}
        <video
          src={video.videoUrl}
          preload="metadata"
          controls
          className=" w-full h:full  aspect-video rounded-xl"
        />
        <div className=" flex flex-col gap-0.5  ">
          {/* Title */}
          <h1 className="lg:text-xl sm:text-2xl md:text-xl ml-1 text-gray-900 text-xl font-semibold mt-2">
            {video.title}
          </h1>

          <div className="  ml-1 flex justify-start items-center gap-3">
            {/* Channel */}
            <Link to={`/channel/${video.channel._id}`}>
              <p className="sm:text-lg lg:text-lg md:text-md text-gray-600 text-sm">
                @{video.channel?.channelName || "Unknown Channel"} •
              </p>
            </Link>

            {/* views */}
            <p className="lg:text-lg sm:text-lg md:text-md text-gray-600 text-sm">{video.views} views</p>
          </div>

          {/*like share download buttons */}
          <div className="py-1  flex gap-2 lg:gap-5 overflow-x-auto scrollbar-hide">
            <img
              src={video.uploader?.avatar || "https://via.placeholder.com/150"}
              alt=""
              className="lg:w-12 w-9 ml-1 rounded-full object-cover h-9 lg:h-auto"
            />

            <button className=" text-sm lg:text-sm gap-1 px-2  bg-gray-950 text-white rounded-2xl">
              Subscribe
            </button>
            <button
              onClick={handleLike}
              className={`lg:text-lg px-3 flex justify-center items-center rounded-xl ${userLiked ? "bg-black text-white" : "bg-gray-100"
                }`}
            >
              <FontAwesomeIcon icon={faThumbsUp} />
              <span className="">{likess}</span>
            </button>

            <button
              onClick={handleDislike}
              className={`lg:text-lg px-3 rounded-xl flex justify-center items-center ${userDisliked ? "bg-black text-white" : "bg-gray-100"
                }`}
            >
              <FontAwesomeIcon icon={faThumbsDown} />
              <span className="py-0">{disLikes}</span>
            </button>
            <button className="lg:text-lg flex items-center text-sm gap-2 px-3 py-0 bg-gray-100 rounded-2xl">
              <FontAwesomeIcon icon={faTelegram} />
              <span className=" lg:text-lg py-0">share</span>
            </button>
            <button className="lg:text-lg flex items-center text-sm gap-2 px-3 py-0 bg-gray-100 rounded-2xl">
              <FontAwesomeIcon icon={faDownload} />
              <span className="lg:text-lg py-0">Download</span>
            </button>
          </div>
        </div>

        {/*description */}
        <div className="mt-4 bg-gray-200 rounded-xl border-b p-4 text-sm">
          {/* Views & Time */}
          <div className="sm:text-lg md:text-md lg:text-lg font-semibold mb-2">
            {video.views} views · {timeAgo(video.createdAt)}
          </div>

          {/* Description */}
          <p className={`${!expanded ? "sm:text-md md:text-lg lg:text-lg line-clamp-3" : ""} whitespace-pre-line`}>
            {video.description}
          </p>

          {/* View More / Less */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 lg:text-lg sm:text-md md:text-md text-black "
          >
            {expanded ? "view less" : "view more.."}
          </button>
        </div>

        {/*comments */}
        <div className=" px-2 ">
          <h1 className=" lg:text-2xl sm:text-xl md:text-2xl text-xl  mt-2 font-semibold mb-1 lg:mb-2">Comments</h1>
          <div className="mb-2 flex gap-1 justify-center items-center">
            <div className="w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm">
              Y
            </div>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="write a comment"
              className="border-2 sm:text-md lg:text-lg text-sm border-gray-300 outline-none flex-1 p-1 rounded-xl w-full mb-0"
            />
            <button
              onClick={addComment}
              className="flex items-center text-sm sm:text-md lg:text-lg gap-2 px-3 py-2 bg-gray-100 rounded-xl"
            >
              Add
            </button>
          </div>
          {comments.map((cmmt) => (
            <div key={cmmt._id} className="flex gap-3 mb-4">
              {/* Avatar */}
              <img
                src={cmmt.user.avatar || "default-avatar-url.png"}
                alt="avatar"
                className="w-9 h-9 sm:w-11 sm:h-11 lg:w-11 lg:h-11 rounded-full object-cover"
              />

              {/* Comment Body */}
              <div className="flex-1">
                {/* Username */}
                <h1 className="text-sm sm:text-md lg:text-md text-gray-800">
                  @{cmmt.user?.username} · {timeAgo(cmmt.createdAt)}
                </h1>
                <span></span>

                {/* Comment Text */}
                <p className="text-sm sm:text-lg md:text-md lg:text-sm  text-black mt-0.5">
                  {cmmt.text}
                </p>

                {/* Action Buttons */}
                {user?._id === cmmt.user?._id && (
                  <div className="flex gap-4 mt-1 text-xs text-blue-600">
                    <button
                      onClick={() => editComment(cmmt._id)}
                      className="sm:text-md lg:text-lg hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteComment(cmmt._id)}
                      className=" sm:text-md lg:text-lg hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* RIGHT COLUMN (Sidebar) */}
      <div className="lg:w-250px  shrink-0">
        <h2 className="font-semibold lg:text-2xl text-sm mb-4">Up next</h2>
        <div className="flex flex-col gap-3">
          {recommendations.map((rec) => (
            <Link to={`/videos/${rec._id}`} key={rec._id} className="flex gap-2 group">
              {/* Sidebar Thumbnail */}
              <div className="w-40 h-24 lg:w-40 lg:h-auto shrink-0 rounded-lg overflow-hidden bg-gray-200">
                <img src={rec.thumbnailUrl} className="w-full h-full object-cover" alt="thumbnail" loading="lazy" />
              </div>
              {/* Sidebar Video Info */}
              <div className="flex flex-col">
                <h4 className="text-sm lg:text-md font-semibold md:line-clamp-2 lg:line-clamp-1 leading-tight group-hover:text-blue-600">
                  {rec.title}
                </h4>
                <p className="text-xs lg:text-md text-gray-500 mt-1">{rec.channel?.channelName}</p>
                <p className="text-xs lg:text-md text-gray-500">{rec.views} views • {timeAgo(rec.createdAt)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
