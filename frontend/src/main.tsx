import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProfileView from './components/ProfileView';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/profile",
    element: <ProfileView />,
  },
]);

const node = document.getElementById('root') as HTMLElement
const root = ReactDOM.createRoot(node)
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
