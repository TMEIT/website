import React from "react";
import styles from "./profile.css"

function Profile ({match}) {
    return (
        <h2>Profile {match.params.id} </h2>
    )
}

export default Profile

