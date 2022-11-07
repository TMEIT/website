import React from "react";
import css from 'styled-jsx/css'

import join_council from "../layout_photos/join_council.webp";
import tmeit_boat from "../layout_photos/tmeit_boat.webp";
import sjo_group from "../layout_photos/sjoslaget_group_2022.webp";

import { kiesel_blue, secondary_purp, me_green, accent_maroon, accent_salmon } from "../palette.js";
import JoinForm from "../components/JoinForm";
import TextSummary from "../components/TextSummary.js";
import Centered from "../components/Centered.js";

export const join_style = css`
    .container {
        width: 100vw;
        display: grid;
        grid: repeat(3, auto) / 100%
    }
    .about-tmeit {
        background: ${accent_salmon};
        width: 100%;
        display: grid;

        grid-template-rows: repeat(2, auto);
    }
    @media (max-width: 80em) {
        .about-tmeit {
            grid-template-columns: 1fr;
        }
    }
    @media (min-width: 80em) {
        .about-tmeit {
            grid-template-columns: 1fr 2fr;
            padding: 2vw;
        }
    }
    h1 {
        grid-area: 1 / 1 / 2 / 3;
        place-self: center;
        text-align: center;
        color: #ffffff;
        font-size: calc(0.6rem + 4vw);
        border-radius: 0.5rem;
        padding: 0.5rem;
        padding-left: 1rem;
        padding-right: 1rem;
    }
    .serious-banner {
        width: 100%;
        place-self: center;
    }
    @media (max-width: 80em) {
        .serious-banner {
            grid-area: 2 / 1;
        }
    }
    @media (min-width: 80em) {
        .serious-banner {
            grid-area: 2 / 2;
            padding: 2vw;
        }
    }
    .about-text {
        width: 100%;
    }
    @media (max-width: 80em) {
        .about-text {
            grid-area: 3 / 1;
        }
    }
    @media (min-width: 80em) {
        .about-text {
            grid-area: 2 / 1 / 4 / 2;
        }
    }
    .cool-banner {
        width: 100%;
        place-self: center;

    }
    @media (max-width: 80em) {
        .cool-banner {
            grid-area: 4 / 1 / 5 / 2;
        }
    }
    @media (min-width: 80em) {
        .cool-banner {
            grid-area: 3 / 2 / 4 / 3;
        }
    }
    .about-tmeit {
        place-self: center;
        grid-area: 3 / 1;
    }
    .joining {
        place-self: center;
        grid-area: 4 / 1;
    }
    .joining>div {
        padding: 1em;
    }
`

function Join() {
  return (
    <div className="container">
        <div className="about-tmeit">
            <h1> So you want to join TMEIT? </h1>
            <img className="serious-banner" src={join_council} alt="A TMEIT marskalk sits with a serious look and judges over a silly TMEIT meeting" />
            <div className="about-text">
                <p>
                    TMEIT is one of the two klubbmästerier at KTH Kista, and we make up a large amount of the student activity at IN-sektionen.
                    As one of the most active klubbmästerier in Stockholm,
                    our members (known as "marshals") are skilled bartenders and run many of the most popular parties in Kista.
                    Our members are well known at student pubs around Stockholm,
                    and many of our alumni members can still be found bartending at Nymble or organizing cruises with Sjöslaget.
                </p>
                <p>
                    As a member of TMEIT, you help run Kistan 2.0 during events about once or twice a month,
                    you join countless student parties both here in Kista and elsewhere in Stockholm,
                    and you join a tight-knit student community with best friends that look out for one-another.
                </p>
                <p> {/*TODO split div here, make into subcomponents to simplify*/}
                    TMEIT isn't the only student club in Kista that runs fun social events.
                    We also have 3 sister clubs in Kista, with both ITK and QMISK here with us at KTH Kista,
                    and DISK just up the road at Stockholm University Kista.
                    All of these student clubs in Kista are good friends with each other,
                    and we all get discounts at each other's events.
                </p>
                <p>
                    No prior bartending experience is needed to join TMEIT.
                    Everyone is welcome to become a PRAO and learn how to run events and become a bartender.
                    Sober lifestyles are also welcome in the klubbmästeri, and we speak both Swedish and English in TMEIT.
                </p>
                <p>
                    TMEIT does not have a hard limit on its member count. Every PRAO is able to become a Marshal when they are ready for it.
                </p>
            </div>
            <img className="cool-banner" src={tmeit_boat} alt="TMEIT sailing the high seas at Sqvalp 2022" />
        </div>
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
            <img className="group-photo" src={sjo_group} alt="A group photo of TMEIT after Sjöslaget 2022" />
        </div>
        <style jsx> {join_style} </style>
    </div>
  )
}

export default Join;
