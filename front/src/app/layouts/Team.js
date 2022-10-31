import React, {Fragment} from "react";
import {Link} from "react-router-dom";
import Loading from "../components/Loading";
import {useFetch} from "../FetchHooks.js";

function Team() {

    const {loading, data} = useFetch("/api/v1/members/");

    let loadMembers = false;
    let loadingElement;
    let masterList, marshalList, praoList, exList, vraqList;

    //Loading
    if(loading) loadingElement = <Loading />;

    //API error
    else if(data === "error") loadingElement = "Could not load API.";

    // render memberlist
    else {
        loadMembers = true;
        loadingElement = null;
        masterList = data.filter(member => member.current_role === "master").map(member =>
                <h3 key={member.uuid} >
                    <Link to={`/profile/${member.short_uuid}/${member.first_name}_${member.last_name}` } >
                        {member.first_name + " " + member.last_name}
                    </Link>
                </h3>
            )
        marshalList = data.filter(member => member.current_role === "marshal").map(member =>
            <h3 key={member.uuid} >
                <Link to={`/profile/${member.short_uuid}/${member.first_name}_${member.last_name}` } >
                    {member.first_name + " " + member.last_name}
                </Link>
            </h3>
        )
        praoList = data.filter(member => member.current_role === "prao").map(member =>
            <h3 key={member.uuid} >
                <Link to={`/profile/${member.short_uuid}/${member.first_name}_${member.last_name}` } >
                    {member.first_name + " " + member.last_name}
                </Link>
            </h3>
        )
        vraqList = data.filter(member => member.current_role === "vraq").map(member =>
            <h3 key={member.uuid} >
                <Link to={`/profile/${member.short_uuid}/${member.first_name}_${member.last_name}` } >
                    {member.first_name + " " + member.last_name}
                </Link>
            </h3>
        )

        exList = data.filter(member => member.current_role === "ex").map(member =>
            <h3 key={member.uuid} >
                <Link to={`/profile/${member.short_uuid}/${member.first_name}_${member.last_name}` } >
                    {member.first_name + " " + member.last_name}
                </Link>
            </h3>
        )

    }


    return (
        <>
        {loadingElement}
        {loadMembers ?
        <Fragment>
            <h1>Team</h1>
            <h2>Masters</h2>            
            {masterList}
            <h2>Marshals</h2>
            {marshalList}
            <h2>Prao</h2>
            {praoList}
            <h2>Vraq</h2>
            {vraqList}
            <h2>Ex-members</h2>
            {exList}
        </Fragment>
        : <></>
        }
    </>
    )
}

export default Team