import {Suspense, lazy, useState} from "react";
import {createRoot} from "react-dom/client";
import {createBrowserRouter, RouterProvider, Outlet, useNavigation} from "react-router-dom";
import styled from "@emotion/styled";
import {ThemeProvider} from '@mui/material/styles';

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
import { kiesel_blue } from "./palette.js";

import DesktopHeader from "./components/HeaderFooter/DesktopHeader";
import { header_height } from "./components/HeaderFooter/DesktopHeader";
import Footer from "./components/HeaderFooter/Footer";
import LoadingBar from "./components/LoadingBar";
const LoginModal =  lazy(() => import("./components/LoginModal"));
import theme from "./muiTheme"

import routes from "./routes.js";
import hasLoginCookie from "./hasLoginCookie";


/**
* Common wrapper for all routes that displays the navbars around the route
*/
function App({className}) {
    const navigation = useNavigation();
    const [loginModalOpen, setLoginModalOpen] = useState(false);

    // State storing whether user is logged in or not. Initializes based on if user has login cookie or not. ( We assume cookie is valid)
    const [loggedIn, setLoggedIn] = useState(hasLoginCookie());

    return (
            <div className={className}>
                <ThemeProvider theme={theme}>
                    {navigation.state === "loading"? <LoadingBar className="loading-bar" />: null}
                    {loginModalOpen? <Suspense><LoginModal loggedIn={loggedIn} setLoggedIn={setLoggedIn} setLoginModalOpen={setLoginModalOpen} /></Suspense>: null}
                    <DesktopHeader loggedIn={loggedIn} setLoginModalOpen={setLoginModalOpen} />
                    <div id="expander">
                        <main>
                            <Suspense>
                                <Outlet />
                            </Suspense>
                        </main>
                        <Footer />
                    </div>
                </ThemeProvider>
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
            await routes.Team.loader();
            return await getApiFetcher().get("/members/").json();
        }
        },
        { path: "/join_tmeit", element: <routes.Join.component />, loader: routes.Join.loader },
        { path: "/profile/:shortUuid", element: <routes.Profile.component />, loader: routes.Profile.loader },
        { path: "/profile/:shortUuid/:name", element: <routes.Profile.component />, loader: routes.Profile.loader },
        { path: "/join_completed", element: <routes.Joined.component />, loader: routes.Joined.loader },
        { path: "/master", element: <routes.MasterMenu.component />, loader: routes.MasterMenu.loader },
        { path: "/migrate/:uuid", element: <routes.WebsiteMigrate.component adminVersion={false} />,
            loader: async ({ params }) => {
                await routes.WebsiteMigrate.loader(); // begin loading page component
                let searchParams = new URLSearchParams(document.location.search)
                const security_token = searchParams.get('token');
                return await getApiFetcher().get(`/migrations/members/${params.uuid}?token=${security_token}`).json();
            }
        },
        { path: "/migrate/:uuid/admin", element: <routes.WebsiteMigrate.component adminVersion={true} />,  // Same migrate page as above, but using admin permissions
            loader: async ({ params }) => {
                await routes.WebsiteMigrate.loader(); // begin loading page component
                return await getApiFetcher().get(`/migrations/members/${params.uuid}/admin`).json();
            }
        },
        { path: "/migrating", element: <routes.WebsiteMigrations.component />,
            loader: async ({ params }) => {
                await routes.WebsiteMigrations.loader();
                return await getApiFetcher().get("/migrations/members/").json();
            }
        },
    ]
}]);

const container = document.getElementById("root");
createRoot(container).render(<RouterProvider router={router} />);
