import {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Button} from "@mui/material";
import styled from "@emotion/styled";

import {DropdownMenu} from "../DropdownMenu.js";
import {getApiFetcher} from "../../api";
import logOut from "../../login_cookie/logOut";
import MenuItem from "@mui/material/MenuItem";
import hasLoginCookie from "../../hasLoginCookie.js";


const StyledMobileHeaderMenu = styled(MobileHeaderMenu)({});

function MobileHeaderMenu({className, loggedIn, setLoginModalOpen}) {
    let navigate = useNavigate();

    const [meData, setMeData] = useState(null); // Yarr, set me data (Logged-in user's member data)

    const loadMeData = async () => {setMeData(await getApiFetcher().get("/me").json())} // Load user information when dropdown is opened
    useEffect(() => { loadMeData() }, []); // Load user information when component is mounted, only once

    const isAdmin = meData && meData.current_role === "master";

    const menuItems = [
        [meData, (meData? <Link to={`/profile/${meData.short_uuid}/${meData.first_name}_${meData.last_name}`}><MenuItem>My Profile</MenuItem></Link>: null)],
        [isAdmin, (<Link to={"/master"}><MenuItem>Master Menu</MenuItem></Link>)],
        [true, (<Link to={"/"}><MenuItem>Home</MenuItem></Link>)],
        [true, (<Link to={"/events"}><MenuItem>Events</MenuItem></Link>)],
        [true, (<Link to={"/team"}><MenuItem>Team</MenuItem></Link>)],
        [true, (<Link to={"/about"}><MenuItem>About TMEIT</MenuItem></Link>)],
        [true, (<Link to={"/join_tmeit"}><MenuItem>Join</MenuItem></Link>)],
        [!loggedIn, (<MenuItem onClick={() => {setLoginModalOpen(true)}}>Log in</MenuItem>)],
        [loggedIn, (<MenuItem onClick={() => logOut(navigate)}>Log Out</MenuItem>)],
        ]

    return (
            <DropdownMenu
                keepOpen
                open={open}
                trigger={<Button className={className}>User Menu</Button>}
                menu={menuItems.reduce(((items, [itemEnabled, item]) => {
                    if (itemEnabled) {
                        items.push(item)
                    }
                    return items
                }), [])}
            />
            );
}

export default StyledMobileHeaderMenu;
