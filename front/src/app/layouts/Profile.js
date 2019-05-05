import React, {Fragment} from "react";
import {Redirect, Link} from "react-router-dom";

import styles from "./profile.css"
import {useFetch} from "../FetchHooks.js"
import Loading from "../components/Loading";
import {currentRolesEN, capitalizeFirstLetter} from "../tmeitStringFn.js"

function Profile ({match}) {

    // Return to team if there's no name given
    if(!match.params.id) return(<Redirect to={"/team"} />);


    const {loading, data} = useFetch("/api/members/" + match.params.id);


    if(data === "error") return(
        <>
            <h1>404: This profile was not found :(</h1>
            Click <Link to={"/team"}>here</Link> to see all of our members.
        </>
    );


    if(loading) {
        return <loading />
    }


    const nickname = data.nickname;
    const fullName = data.first_name + " " + data.last_name;
    const currentWorkteam = data.workteams[0].name; // TODO: Change this to choose all the workteams that are active
    const role = ((current_role) => {
        const string = currentRolesEN.get(current_role).toString();
        return capitalizeFirstLetter(string);
    }) (data.current_role);

    return (
       <>
            <img src={"https://thispersondoesnotexist.com/image"} style={{height: '100px', width: '100px'}}/>
            <h1>{nickname}</h1>
            <h2>{fullName}</h2>
            <h3>{currentWorkteam}</h3>
            <h3>{role}</h3>
            <ul>
                <li></li>
            </ul>
       </>
    )
}

export default Profile

