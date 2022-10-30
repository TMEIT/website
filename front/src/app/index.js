import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import React, { Fragment } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from "react-router-dom";

import { getApiFetcher } from "./api.js";

import styles from "./index.css";
import css_reset from "../reboot.css";

import Home from "./layouts/Home";
import Events from "./layouts/Events";
import Join from "./layouts/Join";
import Team from "./layouts/Team";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Profile from "./layouts/Profile";
import Joined from "./layouts/Joined";
import MasterMenu from "./layouts/MasterMenu";
import WebsiteMigrations from "./layouts/WebsiteMigrations";

const router = createBrowserRouter([{
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/events", element: <Events /> },
      { path: "/team", element: <Team /> },
      { path: "/join_tmeit", element: <Join /> },
      { path: "/profile/:shortUuid", element: <Profile /> },
      { path: "/profile/:shortUuid/:name", element: <Profile /> },
      { path: "/join_completed", element: <Joined /> },
      { path: "/master", element: <MasterMenu /> },
      { path: "/migrating", element: <WebsiteMigrations />,
            loader: async ({ params }) => {
              return await getApiFetcher().get("/migrations/members").json();
            }
        },
    ]
}]);

/**
* Common wrapper for all routes for displaying the navbars
*/
function App() {
  return (
    <>
        <Header />
        <main>
            <Outlet />
        </main>
        <Footer />
    </>
  );
}

const container = document.getElementById("root");
createRoot(container).render(<RouterProvider router={router} />);
