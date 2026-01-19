import React, { useState } from "react";
import Register from "../pages/Register.jsx";
import Login from "../pages/Login.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";

// ADD isSidebarOpen and setIsSidebarOpen as props
function Header({ setSearchText, isSidebarOpen, setIsSidebarOpen }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [authView, setAuthView] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleAvatarClick = () => {
    if (!user) {
      setAuthView("login");
      return;
    }
    if (user.channels && user.channels.length > 0) {
      navigate(`/channel/${user.channels[0]}`);
    } else {
      navigate("/create-channel");
    }
  };

  return (
    <div className="w-full fixed top-0 z-50 bg-white ">
      <header className="flex items-center justify-between px-2 sm:px-4 py-1 bg-white">
        {/* LEFT: Hamburger + Logo */}
        {!searchOpen && (
          <div className="  flex items-center gap-2 md:gap-4">
            {/* Hamburger  */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:flex items-center justify-center text-2xl"
            >
              ☰
            </button>

            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
              <img
                src="https://demo-mern-youtube-clone.vercel.app/logo_black.png"
                alt="Logo"
                className="h-10 md:h-12 lg:h-14 object-contain"
              />
            </div>
          </div>
        )}

        {/* CENTER: Search */}
        <div className={`${searchOpen ? "flex" : "hidden"} md:flex flex-1 items-center justify-center max-w-2xl px-4`}>
          {searchOpen && (
            <button className="md:hidden mr-2" onClick={() => setSearchOpen(false)}>✕</button>
          )}
          <div className="flex w-full items-center bg-gray-100 rounded-2xl px-3 py-1 border border-gray-300 focus-within:border-blue-500">
            <input
              type="text"
              placeholder="Search"
              onChange={(e) => setSearchText(e.target.value)}
              className="bg-transparent text-sm md:text-md lg:text-md  outline-none flex-1 p-1"
            />
            <button className="pl-2 border-l border-gray-300">
              <img src="https://cdn-icons-png.flaticon.com/512/54/54481.png" alt="search" className="w-4 h-4 lg:w-6 lg:h-6" />
            </button>
          </div>
        </div>

        {/* RIGHT AREA */}
        {!searchOpen && (
          <div className="flex items-center gap-1 sm:gap-3 px-2">
            <button className="md:hidden p-2" onClick={() => setSearchOpen(true)}>
              <img src="https://cdn-icons-png.flaticon.com/512/54/54481.png" alt="search" className="w-5 h-5" />
            </button>

            {!user ? (
              <button onClick={() => setAuthView("login")} className="border px-4 py-1 rounded-full text-sm md:text-md lg:text-md font-medium hover:bg-blue-50">
                Login
              </button>
            ) : (
              <div className=" flex items-center px-2 py-1 gap-2 sm:gap-3">

                {/* Avatar + Channel */}
                <div
                  onClick={handleAvatarClick}
                  className="flex items-center gap-1.5 sm:gap-2 cursor-pointer
               hover:bg-gray-100 rounded-md px-1 sm:px-2 transition"
                >
                  {/* Avatar */}
                  <div
                    className="relative w-8 h-8 sm:w-9 sm:h-9
                 rounded-full bg-purple-600 
                 flex items-center justify-center
                 text-white text-sm sm:text-base font-semibold
                 hover:ring-2 hover:ring-purple-300 transition-all"
                  >
                    {user.username?.charAt(0).toUpperCase()}

                    {/* Badge fr mobile */}
                    <span className="absolute -bottom-1 -right-1 sm:hidden
                       text-black  text-[10px]
                       px-1 rounded-full bg-white">
                      Ch
                    </span>
                  </div>

                  {/* Channel Text */}
                  <h6 className="hidden sm:block text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
                    Channel
                  </h6>
                </div>

                
                <span className="hidden md:block h-5 w-px bg-gray-300"></span>

                {/* Logout */}
                <button
                  onClick={logout}
                  className="text-xs sm:text-sm md:text-base
               text-red-500 font-medium hover:underline"
                >
                  Logout
                </button>
              </div>


            )}
          </div>
        )}
      </header>


      {authView === "login" && <Login setAuthView={setAuthView} />}
      {authView === "register" && <Register setAuthView={setAuthView} />}
    </div>
  );
}

export default Header;