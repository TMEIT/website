import {useLoaderData} from "react-router-dom";
import styled from "@emotion/styled";

import MemberListItem from "../components/MemberListItem.js";

// Bit of a hack, filtering result from server to separate types of members instead of filtering on db
const render_memberlist = (members, role) =>
    members.filter(member => member.current_role === role)
    .map(member => <MemberListItem member={member} key={member.uuid}/>);


const StyledMemberList = styled(MemberList)({
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
})

function MemberList({className, children}) {
    return (
        <div className={className}>
            {children}
        </div>
    );
}

const StyledTeam = styled(Team)({
    h1: {
        color: "white"
    },
    h2: {
        color: "white"
    },

    "@media (max-width: 52em)": {
        padding: "0.5em",
    },

    "@media (min-width: 52em)": {
        padding: "1em",
    },
})


function Team({className}) {
    const data = useLoaderData();

    // render memberlists
    //Hide master role hack, remove Lex from masters list
    let masterList = render_memberlist(data.filter(member => member.nickname !== "Lex"), "master");
    const marshalList = render_memberlist(data, "marshal");
    const praoList = render_memberlist(data, "prao");
    const vraqList = render_memberlist(data, "vraq");
    const exList = render_memberlist(data, "ex");

    const lex = {
                    "uuid": "35444776-358b-4e0d-9ce1-fca94b969c9b",
                    "short_uuid": "NURHdjWL",
                    "first_name": "Justin",
                    "nickname": "Lex",
                    "last_name": "Lex-Hammarskjöld",
                    "current_role": "ex",
                }

    return (
        <div className={className}>
            <h1>Team</h1>
            <h2>Masters</h2>
            <StyledMemberList>{masterList}</StyledMemberList>
            <h2>Marshals</h2>
            <StyledMemberList>{marshalList}</StyledMemberList>
            <h2>Prao</h2>
            <StyledMemberList>{praoList}</StyledMemberList>
            <h2>Vraq</h2>
            <StyledMemberList>{vraqList}</StyledMemberList>
            <h2>Ex-marshals</h2>
            <StyledMemberList>{exList}<MemberListItem member={lex} key={lex.uuid}/></StyledMemberList>
        </div>
    );
}

export default StyledTeam;
