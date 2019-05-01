import React, {Fragment} from "react";
import styles from "./profile.css"
import roles from "./variables"

function Profile (props) {
    if(props.member == null) return(<div id={"butts"}></div>);
    return (
       <Fragment>
            <h2>{props.member.first_name + " " + props.member.last_name}</h2>
            <h2>{props.member.nickname}</h2>
       </Fragment>
    )
}

export default Profile

