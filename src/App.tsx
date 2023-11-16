import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { RouterProvider, createBrowserRouter, Outlet } from 'react-router-dom'
import AllPosts from "./AllPosts";
import PostView from "./PostView";
import Welcome from "./Welcome";
import MessageBoard from "./MessageBoard";
import Navbar from './Navbar'

// This tells the browser how to route users to the right component in navigation
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <MessageBoard />,
        children: [
          {
            path: ":pageNumber",
            element: <AllPosts />
          },
          {
            path: "post/:postId",
            element: <PostView />
          },
        ],
      },
      {
        path: "welcome",
        element: <Welcome />
      },
    ],
  },
]);



function App() {
  // This imports the router, defined above into our application, into our application
  return <RouterProvider router={router} />
}

export default App;

function Layout() {
  return <>
    <Navbar />
    <Outlet />
  </>
}