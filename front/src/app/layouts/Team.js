import React, {Fragment} from "react";
import {Link} from "react-router-dom";
import Loading from "../components/Loading";
import {useFetch} from "../FetchHooks.js";

function Team() {

    const {loading, data} = useFetch("/api/members");


    let memberList;

    //Loading
    if(loading) memberList = <Loading />;

    //API error
    else if(data === "error") memberList = "Could not load API.";

    // render memberlist
    else {
        memberList = data.objects.map(member =>
                <h2 key={member.email} >
                    <Link to={"/profile/" + encodeURIComponent(member.email)} >
                        {member.first_name + " " + member.last_name}
                    </Link>
                </h2>
            )
    }


    return (
        <Fragment>
            <h1>Team</h1>
            {memberList}
        </Fragment>
    )
}

export default Team