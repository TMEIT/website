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
    //Hide master role hack, remove WebbMarshals and Lex from masters list
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

    const bänk = {
                    "uuid": "9fd3d5e1-45f9-4664-8af0-75d7d4c3e109",
                    "short_uuid": "n9PV4UX5",
                    "first_name": "Sebastian",
                    "nickname": "Bänk",
                    "last_name": "Divander",
                    "current_role": "WebbMarshal",
                }

    const appelros = {
                    "uuid": "140fe1ec-e010-4e97-bb8e-6497994fa9e3",
                    "short_uuid": "FA_h7OAQ",
                    "first_name": "Gustav",
                    "nickname": null,
                    "last_name": "Appelros",
                    "current_role": "WebbMarshal",
                }

    return (
        <div className={className}>
            <h1>Team</h1>
            <h2>Masters</h2>
            <StyledMemberList>{masterList}</StyledMemberList>
            <h2>Marshals</h2>
            <StyledMemberList>{marshalList} <MemberListItem member={bänk} key={bänk.uuid}/> <MemberListItem member={appelros} key={appelros.uuid}/> </StyledMemberList>
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
