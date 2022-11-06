import React from "react";
import css from 'styled-jsx/css'

import join_council from "../layout_photos/join_council.webp";

import { kiesel_blue, secondary_purp, me_green, accent_maroon, accent_salmon } from "../palette.js";
import JoinForm from "../components/JoinForm";
import TextSummary from "../components/TextSummary.js";
import Centered from "../components/Centered.js";

export const join_style = css`
    .container {
        width: 100%;
        display: grid;
        grid: repeat(3, auto) / 100%
    }
    .banner {
        background: ${accent_salmon};
        width: 100%;
        display: grid;
        grid: repeat(2, auto) / 100%
        padding: 2rem;
    }
    h1 {
        place-self: center;
        text-align: center;
        color: #ffffff;
        font-size: calc(0.6rem + 4vw);
        background: ${accent_salmon_dark};
        border-radius: 0.5rem;
        padding: 0.5rem;
        padding-left: 1rem;
        padding-right: 1rem;
    }
    .banner-img {
        width: 100%;
        max-width: 60rem;
        place-self: center;
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
        <div className="banner">
            <img className="banner-img" src={join_council} alt="A TMEIT marskalk sits with a serious look and judges over a silly TMEIT meeting" />
        </div>
        <div className="about-tmeit">
            <TextSummary>
                <h1> So you want to join TMEIT? </h1>
                <p>
                    TMEIT is one of the most active klubbmästerier in Stockholm.
                    Our members (known as "marshals") are skilled bartenders and run many of the most popular parties in Kista.
                    Our members are well known at student pubs around Stockholm,
                    and many of our alumni members can still be found bartending at Nymble or organizing cruises with Sjöslaget.
                </p>
                <p>
                    TMEIT isn't the only student club in Kista that runs fun social events.
                    We have many sister clubs in Kista, with both ITK and QMISK here with us at KTH Kista,
                    and DISK just up the road at Stockholm University Kista.
                    All of these clubs in Kista are good friends with each other,
                    and we all get discounts at each other's events.
                </p>
                <p>
                    As a member of TMEIT, you help run Kistan 2.0 during events about once or twice a month,
                    you join countless student parties both here in Kista and elsewhere in Stockholm,
                    and you join a tight-knit student community with best friends that look out for one-another.
                </p>
                <p>
                    No prior bartending experience is needed to join TMEIT.
                    Everyone is welcome to become a PRAO (An aspiring tmeit member, it roughly translates to "intern"),
                    and learn how to run events and become a bartender.
                    Sober lifestyles are also welcome in the klubbmästeri, and we speak both Swedish and English in TMEIT.
                </p>
                <p>
                    TMEIT does not have a hard limit on its member count. Everyone is able to become a Marshal when they are ready for it.
                </p>
            </TextSummary>
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
        </div>
        <style jsx> {join_style} </style>
    </div>
  )
}

export default Join;
