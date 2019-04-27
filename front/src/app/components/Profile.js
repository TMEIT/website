import React from "react";
import styles from "./profile.css"

function Profile ({props}) {
    return (
        <div className="container">
            <div className="picture">
                <img src="https://thispersondoesnotexist.com/image" alt="John Doe" />        
            </div>
            <div className="text">
                <h1>Ovvenamn</h1>
                <h2>Jonatan Hindén</h2>
                <p>xx</p>
            </div>
        </div>
    )
}

export default Profile

