import React, {Fragment} from "react";
import styles from "./profile.css"
import {useFetch} from "../FetchHooks.js"
import Loading from "../components/Loading";
import {Redirect, Link} from "react-router-dom";

function Profile ({match}) {

    if(!match.params.id) return(<Redirect to={"/team"} />);

    const {loading, data} = useFetch("/api/members/" + match.params.id);
    console.log(data);
    if(data === "error") return(
        <>
            <h1>404: This profile was not found :(</h1>
            Click <Link to={"/team"}>here</Link> to see all of our members.
        </>
    );

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

