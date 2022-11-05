import React from "react";
import {Link} from "react-router-dom";

import { kiesel_blue, secondary_purp, primary_light } from "../palette.js";
import TextSummary from "../components/TextSummary.js";

function Home() {
    return (
        <div id="home">
            <TextSummary>
                <h1>Welcome!</h1>
                <p>
                    TraditionsMEsterIT (TMEIT) is a klubbmästeri within the Section for Information- and Nanotechnology,
                    which is based at KTH in Kista.
                </p>
                <p>
                    As a klubbmästeri, we arrange many of the chapter's pubs and parties,
                    but also other social events at the university for the chapter's members.
                </p>
                <p>
                    Every Friday (or sometimes Tuesdays) during the university's academic year, we arrange a pub in Kistan 2.0 that is open to everyone.
                    By tradition, we hold the Tentagasque, a party held at the end of every exam period,
                    before the exam pub crawl begins at Campus Valhallavägen.
                    We are a part of Klubbmästarrådet (KMR), and we even arrange KMR gasques.
                </p>
                <p>
                    If you are interested in joining TMEIT, helping out behind the bar at TMEIT's events,
                    and getting to hang out at tons of fun events and parties, you can sign up <Link to="/join_tmeit">here</Link>!
                </p>
            </TextSummary>
            <br/>
            <TextSummary>
                <p>
                    So yeah, this is the new website!
                </p>
                <p>
                    It's still missing a lot of features from the old website, such as member photos, workteams, events, and any trace of the Swedish Language.
                </p>
                <p>
                    If you're interested in learning Python or ReactJS programming, come check out our <a href="https://github.com/TMEIT/website">Github</a>,
                    or join the discussion in the #webbweeb channel on the TMEIT discord!
                </p>
            </TextSummary>
        </div>
    );
}

export default Home