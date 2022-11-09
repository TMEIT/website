import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import React, {lazy} from "react";
import {
    createBrowserRouter,
    RouterProvider,
    Outlet, useNavigation
} from "react-router-dom";
import styled from "@emotion/styled";

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

import Header from "./components/Header";
import { header_height } from "./components/Header";
import Footer from "./components/Footer";
import LoadingBar from "./components/LoadingBar";

import routes from "./routes.js";


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
                        <React.Suspense>
                            <Outlet />
                        </React.Suspense>
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
        { path: "/", element: <routes.Home.component />, loader: routes.Home.loader },
        { path: "/events", element: <routes.Events.component />, loader: routes.Events.loader },
        { path: "/team", element: <routes.Team.component />,
        loader: async ({ params }) => {
            await routes.Team.loader()
            return await getApiFetcher().get("/members").json();
        }
        },
        { path: "/join_tmeit", element: <routes.Join.component />, loader: routes.Join.loader },
        { path: "/profile/:shortUuid", element: <routes.Profile.component />, loader: routes.Profile.loader },
        { path: "/profile/:shortUuid/:name", element: <routes.Profile.component />, loader: routes.Profile.loader },
        { path: "/join_completed", element: <routes.Joined.component />, loader: routes.Joined.loader },
        { path: "/master", element: <routes.MasterMenu.component />, loader: routes.MasterMenu.loader },
        { path: "/migrating", element: <routes.WebsiteMigrations.component />,
            loader: async ({ params }) => {
                await routes.WebsiteMigrations.loader()
                return await getApiFetcher().get("/migrations/members").json();
            }
        },
    ]
}]);

const container = document.getElementById("root");
createRoot(container).render(<RouterProvider router={router} />);
