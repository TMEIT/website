import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import React, { Fragment } from "react";
import {
    createBrowserRouter,
    RouterProvider,
    Outlet, useNavigation
} from "react-router-dom";
import styled from "@emotion/styled";

import { createTheme, ThemeProvider } from '@mui/material/styles'
import LinearProgress from "@mui/material/LinearProgress";

import "@fontsource/atkinson-hyperlegible"
import "@fontsource/cantarell"
import "@fontsource/caveat"
import "@fontsource/merriweather"
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { getApiFetcher } from "./api.js";

import css_reset from "../reboot.css";
import { kiesel_blue, secondary_purp, data_pink } from "./palette.js";

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


const loading_bar_color = createTheme({
    palette: {
        primary: {
            main: data_pink,
        }
    },
});

const LoadingBar = ({className}) => {
    return (
        <ThemeProvider theme={loading_bar_color}>
            <LinearProgress className={className} />
        </ThemeProvider>
    )
}


/**
* Common wrapper for all routes that displays the navbars around the route
*/
function App({className}) {
    const navigation = useNavigation();
    return (
            <div className={className}>
                {navigation.state === "loading"? <LoadingBar className="loading-bar" />: null}
                <Header />
                <div id="expander">
                    <main>
                        <Outlet />
                    </main>
                    <Footer />
                </div>
            </div>
            );
}


const StyledApp = styled(App)({
    background: kiesel_blue,
    fontFamily: "'Atkinson Hyperlegible', arial, sans-serif",
    ".loading-bar": {
        width: "100vw",
        position: "fixed",
        top: 0
    },
    "& > #expander": {
        minHeight: `calc(100vh - ${header_height})`,
        display: "grid",
        gridTemplateRows: "1fr auto",
    },
    "a:link": { color: "#444444" },
    "a:visited": { color: "#444444"},
    "a:hover": { color: "#444444"},
    "a:active": { color: "#444444"}
});


const router = createBrowserRouter([{
    element: <StyledApp />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/events", element: <Events /> },
      { path: "/team", element: <Team />,
            loader: async ({ params }) => {
              return await getApiFetcher().get("/members").json();
            }
      },
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

const container = document.getElementById("root");
createRoot(container).render(<RouterProvider router={router} />);
