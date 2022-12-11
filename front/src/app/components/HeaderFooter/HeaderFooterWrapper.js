import {Suspense, lazy, useState} from "react";
import styled from "@emotion/styled";

import { getApiFetcher } from "../../api.js";

import { kisel_blue } from "../../palette.js";

import DesktopHeader from "./DesktopHeader";
import { header_height } from "./DesktopHeader";
import Footer from "./Footer";
const LoginModal =  lazy(() => import("../LoginModal"));

import hasLoginCookie from "../../hasLoginCookie";
import useIsScreenWide from "../../useIsScreenWide";

const StyledHeaderFooterWrapper = styled(HeaderFooterWrapper)({
    "& > #expander": {
        minHeight: `calc(100vh - ${header_height})`,
        display: "grid",
        gridTemplateRows: "1fr auto",
    },
});


/**
* Common wrapper for all routes that displays the navbars around the route
*/
function HeaderFooterWrapper({className, children}) {
    const [loginModalOpen, setLoginModalOpen] = useState(false);

    // State storing whether user is logged in or not. Initializes based on if user has login cookie or not. (We assume cookie is valid)
    const [loggedIn, setLoggedIn] = useState(hasLoginCookie());

    // Switch between mobile header and desktop header/footer at 950 px
    // 950 px should be wide enough for 5 links on the desktop header
    // 950 px is also less than half of 1920 px but more than the 810 px of an iPad.
    const screenIsWide = useIsScreenWide(950)

    if(screenIsWide) {
        return (
            <div className={className}>
                {loginModalOpen?
                (<Suspense>
                    <LoginModal loggedIn={loggedIn} setLoggedIn={setLoggedIn} setLoginModalOpen={setLoginModalOpen} />
                </Suspense>)
                : null
                }
                <DesktopHeader loggedIn={loggedIn} setLoginModalOpen={setLoginModalOpen} />
                <div id="expander">
                    <div>{children}</div>
                    <Footer />
                </div>
            </div>
        );
    } else {
        return (
            <div className={className}>
                {loginModalOpen?
                (<Suspense>
                    <LoginModal loggedIn={loggedIn} setLoggedIn={setLoggedIn} setLoginModalOpen={setLoginModalOpen} />
                </Suspense>)
                : null
                }
                <DesktopHeader loggedIn={loggedIn} setLoginModalOpen={setLoginModalOpen} />
                <div id="expander">
                    {children}
                </div>
            </div>
        );
    }
}

export default StyledHeaderFooterWrapper;
