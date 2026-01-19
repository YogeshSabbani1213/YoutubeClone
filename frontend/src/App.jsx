import React, { useState } from 'react'
import { lazy, Suspense } from 'react';
import './app.css';
import Header from './components/Header.jsx'
import {Toaster} from 'react-hot-toast'
import { Outlet, useNavigate } from 'react-router-dom'

const App = () => {
  const [searchText, setSearchText] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate()
  const Loader = () => (
    <div className="h-screen flex items-center justify-center">
      <p className="text-lg font-semibold">Loading...</p>
    </div>
  );
  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-center" reverseOrder={false} />
      {/* HEADER */}
      <Header
        setSearchText={setSearchText}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* MAIN LAYOUT CONTAINER */}
      <div className="flex pt-14 md:pt-16">

        {/* SIDEBAR  */}
        {isSidebarOpen && (
          <aside className=" lg:mt-3 md:w-50  lg:w-64 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto bg-white ">
            <nav className=" flex flex-col gap-1 p-2">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-4 p-3 hover:bg-gray-100 md:text-xl rounded-xl font-bold"
              >
                🏠︎ Home
              </button>
              <button className=" md:text-lg lg:text-xl hover:bg-gray-100 flex items-center gap-4 p-3 text-gray-800 cursor-default">
                🗀 Subscriptions
              </button>
              <button className=" md:text-lg lg:text-xl  hover:bg-gray-100 flex items-center gap-4 p-3 text-gray-800 cursor-default">
                ◴ History
              </button>
              <button className="md:text-lg lg:text-xl  hover:bg-gray-100 flex items-center gap-4 p-3 text-gray-800 cursor-default">
                Subsciptions
              </button>
              <button className="md:text-lg lg:text-xl  hover:bg-gray-100 flex items-center gap-4 p-3 text-gray-800 cursor-default">
                Shorts
              </button>
              <button className=" md:text-lg lg:text-xl   hover:bg-gray-100 flex items-center gap-4 p-3 text-gray-800 cursor-default">
                Playlist
              </button>
              <button className=" md:text-lg lg:text-xl  hover:bg-gray-100 flex items-center gap-4 p-3 text-gray-800 cursor-default">
                Watch later
              </button>
              <button className=" md:text-lg lg:text-xl   hover:bg-gray-100 flex items-center gap-4 p-3 text-gray-800 cursor-default">
                Liked Videos
              </button>
              <button className="md:text-lg lg:text-xl  hover:bg-gray-100 flex items-center gap-4 p-3 text-gray-800 cursor-default">
                Music
              </button>
            </nav>
          </aside>
        )}

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-x-hidden">
          {/* Pass isSidebarOpen to the Home page so the grid can adjust */}
          <Suspense fallback={<Loader />}>
            <Outlet context={{ isSidebarOpen, searchText }} />
          </Suspense>
        </main>
      </div>
    </div>
  )
}

export default App
