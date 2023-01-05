import styled from "@emotion/styled";

import join_council from "../layout_photos/join_council.webp";
import tmeit_boat from "../layout_photos/tmeit_boat.webp";

import { kisel_blue, secondary_purp, me_green, accent_maroon, accent_salmon } from "../palette.js";
import JoinWhatTmeit from "../components/JoinWhatTmeit.js";
import JoinWhyJoin from "../components/JoinWhyJoin.js";


const StyledJoinAboutTmeitMobile = styled(JoinAboutTmeitMobile)({
    background: accent_salmon,
    "div, img": {
        width: "100%"
    },
    ".salmon": { background: accent_salmon },
    ".green": { background: me_green },
    [JoinWhatTmeit]: {padding: "1em"},
    [JoinWhyJoin]: {padding: "1em"},
});

function JoinAboutTmeitMobile({className}) {
  return (
    <div className={className}>
        <div className="green">
            <img className="serious-banner" src={join_council} alt="A TMEIT marskalk sits with a serious look and judges over a silly TMEIT meeting" />
            <JoinWhatTmeit />
        </div>
        <div className="salmon">
            <img className="cool-banner" src={tmeit_boat} alt="TMEIT sailing the high seas at Sqvalp 2022" />
            <JoinWhyJoin />
        </div>
    </div>
  )
}

export default StyledJoinAboutTmeitMobile;
