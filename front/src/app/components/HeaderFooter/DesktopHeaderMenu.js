import {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Button} from "@mui/material";
import styled from "@emotion/styled";

import {DropdownMenu, DropdownMenuItem} from "../DropdownMenu.js";
import {getApiFetcher} from "../../api";
import logOut from "../../login_cookie/logOut";


const StyledDesktopHeaderMenu = styled(DesktopHeaderMenu)({});

function DesktopHeaderMenu({className}) {
    let navigate = useNavigate();

    const [meData, setMeData] = useState(null); // Yarr, set me data (Logged-in user's member data)

    const loadMeData = async () => {setMeData(await getApiFetcher().get("/me").json())} // Load user information when dropdown is opened
    useEffect(() => { loadMeData() }, []); // Load user information when component is mounted, only once

    const isAdmin = meData && meData.current_role === "master";

    const menuItems = [
        [meData, (meData? <Link to={`/profile/${meData.short_uuid}/${meData.first_name}_${meData.last_name}`}><DropdownMenuItem>My Profile</DropdownMenuItem></Link>: null)],
        [isAdmin, (<Link to={"/master"}><DropdownMenuItem>Master Menu</DropdownMenuItem></Link>)],
        [true, (<DropdownMenuItem onClick={() => logOut(navigate)}>Log Out</DropdownMenuItem>)],
    ]

    return (
        <DropdownMenu
            keepOpen
            open={open}
            trigger={<Button>User Menu</Button>}
            menu={menuItems.reduce(((items, [itemEnabled, item]) => {
                if (itemEnabled) {
                    items.push(item)
                }
                return items
            }), [])}
        />
    );
}

export default StyledDesktopHeaderMenu;
