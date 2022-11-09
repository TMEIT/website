import React from "react";
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

function Team() {
    const data = useLoaderData();

    // render memberlist
    const masterList = render_memberlist(data, "master");
    const marshalList = render_memberlist(data, "marshal");
    const praoList = render_memberlist(data, "prao");
    const vraqList = render_memberlist(data, "vraq");
    const exList = render_memberlist(data, "ex");

    return (
        <>
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
            <StyledMemberList>{exList}</StyledMemberList>
        </>
    );
}

export default Team