import {Link} from "react-router-dom";
import styled from "@emotion/styled";

import website_header_text from "../layout_photos/website_header_text.png";
import tmeit_long_logo_nogojan_mono from "../logos/LogoTMEIT_HiLong_nogojan_mono.webp";
import { kiesel_blue, kiesel_light_blue, me_green, data_pink, laser_purp, me_and_in_teal, secondary_purp, primary_light, primary_lighter, secondary_purp_dark, accent_yellow, accent_red, accent_maroon, accent_salmon } from "../palette.js";
import TextSummary from "../components/TextSummary.js";
import Centered from "../components/Centered.js";


// Pick random colors for the banner
const colors = [kiesel_light_blue, me_green, data_pink, laser_purp, me_and_in_teal, accent_yellow, accent_red];
const colorsToUse = colors.sort(() => .5 - Math.random()).slice(0, 2);
const color0 = colorsToUse[0];
const color1 = colorsToUse[1];
const shadowFilter = `invert() drop-shadow(0 2vw 0px ${color0}) drop-shadow(0 2vw 0px ${color1})`;


const StyledHome = styled(Home)({
    margin: "2em",
    ".stylish-header": {
        width: "80vw",
        maxWidth: "85rem",
        marginBottom: "6vw",
    },
    ".content": {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(38em, 100%), 1fr))",
        gridAutoFlow: "row",
        gap: "1rem"
    },
    ".long-logo": {
        width: "100%",
        filter: shadowFilter
    },
    ".website-header": {
        height: "10vw",
        maxHeight: "4em",
        imageRendering: ["crisp-edges", "pixelated"]
    }
});

function Home({className}) {
    return (
        <div className={className}>
            <Centered>
                <div className="stylish-header">
                    <img className="long-logo" src={tmeit_long_logo_nogojan_mono} alt="TraditionsMEsterIT" />
                </div>
            </Centered>
            <div className="content">
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
                <TextSummary>
                    <img className="website-header" src={website_header_text} alt="TMEIT.SE GEN 3" />
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
        </div>
    );
}

export default StyledHome