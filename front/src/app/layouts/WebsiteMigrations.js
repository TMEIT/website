import {Link, useLoaderData} from "react-router-dom";
import Button from "@mui/material/Button";

function WebsiteMigrations() {
    let data = useLoaderData();
    data = data.filter((mwm) => mwm.migrated !== true) // Only list members that haven't completed migration

    let memberList = data.map(mwm =>
        <h2 key={mwm.uuid} >
            <Link to={`/migrate/${mwm.uuid}/admin` } >
                {mwm.first_name + " " + mwm.last_name}
            </Link>
        </h2>
    )

    return (
        <>
            <h1>Members with a pending migration from old website</h1>
            <Button style={{marginTop: "3em", marginBottom: "3em"}} variant="contained"><Link to="/master">Back to Master Menu</Link></Button>
            {memberList}
        </>
    )
}

export default WebsiteMigrations