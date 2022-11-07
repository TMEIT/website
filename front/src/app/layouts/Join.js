import React, {useState, useEffect} from "react";
import css from 'styled-jsx/css';

import sjo_group from "../layout_photos/sjoslaget_group_2022.webp";

import { kiesel_blue, secondary_purp, me_green, accent_maroon, accent_salmon } from "../palette.js";
import JoinForm from "../components/JoinForm";
import TextSummary from "../components/TextSummary.js";
import Centered from "../components/Centered.js";
import JoinAboutTmeitMobile from "./JoinAboutTmeitMobile.js";
import JoinAboutTmeitWide from "./JoinAboutTmeitWide.js";

const useIsScreenWide = () => {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
        function handleResize() {
            setScreenWidth(window.innerWidth);
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize);
    });

    return screenWidth >= 1280;
};

export const join_style = css`
    .container {
        width: 100vw;
    }
    h1 {
        place-self: center;
        text-align: center;
        color: #ffffff;
        font-size: calc(0.6rem + 4vw);
        font-family: Cantarell, sans-serif;
        font-weight: 900;
        border-radius: 0.5rem;
        padding: 0.5rem;
        padding-left: 1rem;
        padding-right: 1rem;
    }
    .joining {
        place-self: center;
    }
    .joining>div {
        padding: 1em;
    }
    .group-photo {
        width: 100%;
    }
`;

function Join() {
    const screenIsWide = useIsScreenWide();

    // Switch layouts based on media query
    const AboutTmeit = screenIsWide ? JoinAboutTmeitWide : JoinAboutTmeitMobile;

  return (
    <div className="container">
        <h1> So you want to join TMEIT? </h1>
        <AboutTmeit />
        <div className="joining">
            <TextSummary>
                <p>
                    We're always looking for new people to join our community, and the period to become a PRAO is open all year long.
                </p>
                <p>
                    Just sign up using the form, and you'll be invited to all of TMEIT's events!
                    We'll also create an account for you here on tmeit.se, so you can see everything that's happening in the klubbmästeri.
                </p>
                <p>
                    Make sure you check your email for the confirmation email we'll send you when your account is confirmed.
                </p>
                <p>
                    If you're joining us during Mottagning,
                    note that TMEIT holds a special meeting at the end of Mottagning with all new PRAO that you don't want to miss!
                </p>
            </TextSummary>
            <JoinForm />;
        </div>
        <h1> See you at the pub! </h1>
        <img className="group-photo" src={sjo_group} alt="A group photo of TMEIT after Sjöslaget 2022" />
        <style jsx> {join_style} </style>
    </div>
  )
}

export default Join;
