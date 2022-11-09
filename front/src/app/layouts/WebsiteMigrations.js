import {Fragment} from "react";
import {
    Link,
    useLoaderData
} from "react-router-dom";

function WebsiteMigrations() {
    const data = useLoaderData();

    let memberList = data.map(mwm =>
        <h2 key={mwm.uuid} >
            <Link to={`/migrating/member/${mwm.uuid}` } >
                {mwm.first_name + " " + mwm.last_name}
            </Link>
        </h2>
    )

    return (
        <>
            <h1>Members with a pending migration from old website</h1>
            {memberList}
        </>
    )
}

export default WebsiteMigrations