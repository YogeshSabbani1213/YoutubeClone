import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { lazy, Suspense } from "react";

const Home = lazy(() => import("./pages/Home.jsx"));
const VideoPlayer = lazy(() => import("./pages/VideoPlayer.jsx"));
const ChannelPage = lazy(() => import("./pages/ChannelPage.jsx"));
const CreateChannel = lazy(() => import("./pages/CreateChannel.jsx"));

const Loader = () => (
  <div className="h-screen flex items-center justify-center">
    <p className="text-lg font-semibold">Loading...</p>
  </div>
);
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Loader />}>
        <App />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loader />}>
            <Home />
          </Suspense>
        )
      },
      {
        path: '/videos/:id',
        element:(
          <Suspense fallback={<Loader/>}>
            <VideoPlayer />
          </Suspense>
        ) 
      },

      {
        path: '/create-channel',
        element: (
          <Suspense fallback={<Loader/>}>
            <CreateChannel />
          </Suspense>
        ) 
      },
      {
        path: '/channel/:id',
        element: (
          <Suspense fallback={<Loader/>}>
            <ChannelPage />
          </Suspense>
        ) 
      },

    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={appRouter} />
  </AuthProvider>
);
