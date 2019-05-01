import React, {Fragment} from "react";
import {Link} from "react-router-dom";
import Loading from "../components/Loading";
import {useFetch} from "../FetchHooks.js";

function Team() {

    const {loading, members} = useFetch("/api/members");

    return (
        <Fragment>
            <h1>Team</h1>
            {loading? <Loading /> : 
                (!loading && members.objects.map(member =>
                    <h2 key={member.email} >
                        <Link to={"/profile/" + member.email} >
                            {member.first_name + " " + member.last_name}
                        </Link>
                    </h2>
                ))
            }
        </Fragment>
    )
}

export default Team