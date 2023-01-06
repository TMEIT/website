import {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Button} from "@mui/material";
import styled from "@emotion/styled";

import {DropdownMenu} from "../DropdownMenu.js";
import {getApiFetcher} from "../../api";
import getUserMenuItems from "./navs/UserMenu";


const StyledDesktopHeaderMenu = styled(DesktopHeaderMenu)({});

function DesktopHeaderMenu({className}) {
    let navigate = useNavigate();

    const [meData, setMeData] = useState(null); // Yarr, set me data (Logged-in user's member data)

    const loadMeData = async () => {setMeData(await getApiFetcher().get("/me").json())} // Load user information when dropdown is opened
    useEffect(() => { loadMeData() }, []); // Load user information when component is mounted, only once

    return (
        <DropdownMenu
            keepOpen
            open={open}
            trigger={<Button>User Menu</Button>}
            menu={getUserMenuItems(navigate, meData)}
        />
    );
}

export default StyledDesktopHeaderMenu;
