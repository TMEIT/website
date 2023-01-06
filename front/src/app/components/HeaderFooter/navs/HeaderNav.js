import {NavLink} from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";

/**
* Returns a list of NavLinks which will then be wrapped in li tags if its a traditional nav,
* Or the items can be thrown into the DropdownMenu props if its used in a dropdown menu
* wrapInMenuItem argument determines if the link should be styled as a menu item or as text.
*/
const getHeaderNavItems = (wrapInMenuItem) => {
    const links = {
        "/events": "Events",
        "/team": "Team",
        "/join_tmeit": "Join",
        "/documents": "Documents",
    }
    if(wrapInMenuItem) {
        return Object.entries(links).map(([path, label]) => (
            <NavLink to={path} activeclassname="selected">
                <MenuItem>{label}</MenuItem>
            </NavLink>
        ));
    } else {
        return Object.entries(links).map(([path, label]) => (
            <NavLink to={path} activeclassname="selected">
                {label}
            </NavLink>
        ));
    }
}

export default getHeaderNavItems;
