import {Link} from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";

import logOut from "../../../login_cookie/logOut";

const getUserMenuItems = (navigate, meData) => {

    if(!meData) {
        return [];
    }

    const isAdmin = meData.current_role === "master";

    const myProfileLink = <Link to={`/profile/${meData.short_uuid}/${meData.first_name}_${meData.last_name}`}><MenuItem>My Profile</MenuItem></Link>;
    const MasterMenuLink = <Link to={"/master"}><MenuItem>Master Menu</MenuItem></Link>;
    const LogOutButton = <MenuItem onClick={() => logOut(navigate)}>Log Out</MenuItem>;

    if(isAdmin) {
        return [
            myProfileLink,
            MasterMenuLink,
            LogOutButton
        ]
    } else {
        return [
            myProfileLink,
            LogOutButton
        ]
    }
}

export default getUserMenuItems;
