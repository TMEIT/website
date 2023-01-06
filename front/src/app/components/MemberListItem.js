import {Link} from "react-router-dom";
import styled from '@emotion/styled'

import { kisel_blue, secondary_purp, secondary_purp_dark, primary_light, primary_lighter, accent_yellow } from "../palette.js";

const StyledMemberNameLine = styled(MemberNameLine)({
    display: "grid",
    gridTemplateRows: "auto auto",
//    alignItems: "baseline",
    "& > *": {
        margin: 0,
    },
    "& > h2": {
        fontSize: "2em",
        color: "#000000",
        margin: 0,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    "& > h3": {
        fontSize: "1.2em",
        color: "#555555",
        margin: 0,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        lineHeight: 1
    },
})

function MemberNameLine({ member, className }) {
    const nickname = member.nickname;
    const full_name = `${member.first_name} ${member.last_name}`;
    if(nickname != null) {  // Display nickname first
        return (
            <div className={className}>
                <h2>{nickname}</h2>
                <h3>{full_name}</h3>
            </div>
        );
    } else {  // No nickname
        return (
            <div className={className}>
                <h2>{full_name}</h2>
            </div>
        );
    }
}


const StyledMemberRoleLine = styled(MemberRoleLine)({
    fontSize: "1.2em",
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    alignItems: "end",
    color: "#000000",
})

function MemberRoleLine({ member, className }) {
    const role = member.current_role;
    if(role == "marshal" || role == "prao") {  // member should have a workteam
        const workteam = "α"
        return (
            <div className={className}>
                <span>{workteam}</span>
                <span>{role}</span>
            </div>
        );
    } else {
        return (
            <div className={className}>
                <span>{role}</span>
            </div>
        );
    }
}


const StyledMemberListItem = styled(MemberListItem)({
    width: "24em",
    background: primary_lighter,
    border: "2px solid black",
    borderRadius: "1em",
    padding: "0.5em",

    display: "grid",
    grid: `"pic name child" 50%
           "pic role child" 50%
           / auto 1fr auto`,
    columnGap: "0.5em",
    img: {
        gridArea: "pic",
        alignSelf: "center",
        height: "5em",
        width: "5em",
        objectFit: "cover",
        border: "1px solid black",
        borderRadius: "0.5em",
    },
    [StyledMemberNameLine]: {
        gridArea: "name",
    },
    [StyledMemberRoleLine]: {
        gridArea: "role",
    },

    // Don't style text just because item is a link
    textDecoration: "none",
    "a:link": { color: "black", textDecoration: "none" },
    "a:visited": { ccolor: "black", textDecoration: "none" },
    "a:hover": { color: "black", textDecoration: "none" },
    "a:active": { color: "black", textDecoration: "none" },

    // Shrink item if on tiny screen
    "@media (max-width: 25em)": {
        fontSize: "0.9em"
    }
})

function MemberListItem({ member, className, ExtraButtonsComponent }) {
    const full_name = `${member.first_name} ${member.last_name}`;
    return (
        <Link className={className} to={`/profile/${member.short_uuid}/${member.first_name}_${member.last_name}` }>
            <img
                src={"https://thispersondoesnotexist.com/image"}
                alt={`Profile picture for ${full_name}`}
            />
            <StyledMemberNameLine member={member} />
            <StyledMemberRoleLine member={member} />
            {ExtraButtonsComponent ?
                <ExtraButtonsComponent css={{gridArea: "child"}} />
                : null
            }
        </Link>
    )
}

export default StyledMemberListItem;
