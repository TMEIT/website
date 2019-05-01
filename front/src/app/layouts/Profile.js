import React, {Fragment} from "react";
import styles from "./profile.css"
import {useFetch} from "../FetchHooks.js"
import Loading from "../components/Loading";

function Profile ({match}) {
    const {loading, member} = useFetch("/api/members" + match.params.id);

    return (
       <Fragment>
           {loading? <Loading/> :
                <Fragment>
                    <h2>{member.first_name + " " + member.last_name}</h2>
                    <h2>{member.nickname}</h2>
                </Fragment>
           }
       </Fragment>
    )
}

export default Profile

