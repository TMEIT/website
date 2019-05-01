import React, {Fragment} from "react";
import styles from "./profile.css"
import {useFetch} from "../FetchHooks.js"
import Loading from "../components/Loading";

function Profile ({match}) {
    const {loading, data} = useFetch("/api/members/" + match.params.id);

    return (
       <Fragment>
           {loading ? <Loading/> :
                <Fragment>
                    <h2>{data.first_name + " " + data.last_name}</h2>
                    <h2>{data.nickname}</h2>
                </Fragment>
           }
       </Fragment>
    )
}

export default Profile

