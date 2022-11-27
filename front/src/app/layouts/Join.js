import {useState, useEffect} from "react";
import styled from "@emotion/styled";

import sjo_group from "../layout_photos/sjoslaget_group_2022.webp";

import { kisel_blue, secondary_purp, secondary_purp_dark, me_green, data_pink, me_and_in_teal, primary_light, primary_lighter, accent_yellow, accent_maroon, accent_salmon } from "../palette.js";
import JoinForm from "../components/JoinForm";
import TextSummary from "../components/TextSummary.js";
import Centered from "../components/Centered.js";
import JoinAboutTmeitMobile from "./JoinAboutTmeitMobile.js";
import JoinAboutTmeitWide from "./JoinAboutTmeitWide.js";
import useIsScreenWide from "../useIsScreenWide";

const StyledJoin = styled(Join)({
    width: "100vw",
    h1: {
        placeSelf: "center",
        textAlign: "center",
        color: "#ffffff",
        fontSize: "calc(0.6rem + 4vw)",
        fontFamily: "Cantarell, sans-serif",
        fontWeight: 900,
        padding: "1em",
        paddingBottom: "0.5em",
    },
    ".joining": {
        display: "grid",
    },
    "@media (max-width: 60rem)": {
        ".joining": {
            grid: '"about" auto "form" auto "gdpr" auto / 1fr'
        },
        ".joining > div": {
            padding: "1em"
        },
    },
    "@media (min-width: 60rem)": {
        ".joining": {
            grid: '"about form gdpr" auto / 1fr 1fr 1fr'
        },
        ".joining > div": {
            padding: "2em"
        },
    },
    ".aboutJoining": {
        gridArea: "about",
        background: me_and_in_teal,
        fontSize: "1.5em",
    },
    [JoinForm]: {
        gridArea: "form",
        background: primary_lighter
    },
    ".gdpr": {
        gridArea: "gdpr",
        background: data_pink
    },
    ".group-photo": {
        width: "100%"
    }
});

function Join({className}) {
    const screenIsWide = useIsScreenWide();

    // Switch layouts based on media query
    const AboutTmeit = screenIsWide ? JoinAboutTmeitWide : JoinAboutTmeitMobile;

  return (
      <div className={className}>
        <h1> So you want to join TMEIT? </h1>
        <AboutTmeit />
        <h1> Become PRAO! </h1>
        <div className="joining">
            <div className="aboutJoining">
                <h2> How to join TMEIT </h2>
                <p>
                    We're always looking for new people to join our community, and the period to become a PRAO is open all year long.
                </p>
                <p>
                    Just sign up using the form, and you'll be invited to all of TMEIT's events!
                    We'll also create an account for you here on tmeit.se, so you can see everything that's happening in the klubbmästeri.
                </p>
                <br />
                <h2> Once you've signed up </h2>
                <p>
                    Make sure you check your email for the confirmation email we'll send you when your account is confirmed.
                </p>
                <p>
                    If you're joining us during Mottagning,
                    note that TMEIT holds a special meeting at the end of Mottagning with all new PRAO that you don't want to miss!
                </p>
            </div>
            <JoinForm />;
            <div className="gdpr">
                <h2> Your personal data </h2>
                <h3> How your personal data is used </h3>
                <p>
                    As a club organizing social activities for its members, TMEIT stores data about you to help plan these activities and facilitate social interaction with other members.
                    Some of the data we store includes your name, your email address, your phone number, when your account was created,
                    special events that happen during your membership in TMEIT, Workteams you participate in, events you attended, photos uploaded of you,
                    and any other data that you or other members upload to the site.
                </p>
                <h3> Who can see your data </h3>
                <p>
                    As a member of TMEIT, your name, some photos of you, your rank in TMEIT, your current Workteam,
                    and whether you have attended/are attending an event are displayed publicly on the website.
                    Please contact one of the Masters if this is an issue.
                    All other personal data can only be seen by other members of TMEIT.
                </p>
                <h3> Website logs </h3>
                <p>
                    To combat bots and spammers, we log page accesses and their associated IP addresses and store those logs for three months.
                    When the PRAO form is filled out, we also log the IP address of the user who submitted the form.
                    Only administrators can see these logs and IP addresses.
                </p>
                <h3> Data security, data controllers, and data processors </h3>
                <p>
                    All personal data is stored securely in the EU in Finnish and Dutch datacenters with our cloud providers Hetzner and Backblaze.
                    If you have any questions or concerns about how we use your personal data, please contact one of the Masters.
                </p>
            </div>
        </div>
        <h1> See you at the pub! </h1>
        <img className="group-photo" src={sjo_group} alt="A group photo of TMEIT after Sjöslaget 2022" />
    </div>
  )
}

export default StyledJoin;
