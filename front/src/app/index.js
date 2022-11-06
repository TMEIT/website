import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import React, { Fragment } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from "react-router-dom";

import css from 'styled-jsx/css'

import { getApiFetcher } from "./api.js";

import css_reset from "../reboot.css";
import { kiesel_blue, secondary_purp } from "./palette.js";

import fonts from "./fonts.js"

import Home from "./layouts/Home";
import Events from "./layouts/Events";
import Join from "./layouts/Join";
import Team from "./layouts/Team";
import Header from "./components/Header";
import { header_height } from "./components/Header";
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


const global_style = css.global`
    html {
        font-family: 'Atkinson Hyperlegible', arial, sans-serif;
    }
    a:link { color: #444444; }
    a:visited { color: #444444;}
    a:hover { color: #444444;}
    a:active { color: #444444;}
`

export const main_container_style = css`
    #background {
        background: ${kiesel_blue};
    }
    #expander {
        min-height: calc(100vh - ${header_height});
        display: grid;
        grid-template-rows: 1fr auto;
    }
    main {
        padding: 2rem;
    }
`


/**
* Common wrapper for all routes for displaying the navbars
*/
function App() {
  return (
    <div id="background">
        <Header />
        <div id="expander">
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
        <style jsx global> {global_style} </style>
        <style jsx> {main_container_style} </style>
        <style jsx global> {fonts} </style>
    </div>
  );
}

const container = document.getElementById("root");
createRoot(container).render(<RouterProvider router={router} />);
