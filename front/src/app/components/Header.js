import React from "react";
import {NavLink} from "react-router-dom";

const HeaderBox = styled.div`
    background-color: #c5c5c5;
    height: 100%;
`;

const Navigation = styled.nav`
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
`;



function Header() {
    return (
        <HeaderBox className={props.className()}>
            <Navigation>
                <NavLink to="/" activeClassName="selected">TMEIT</NavLink>
                <NavLink to="/events" activeClassName="selected">Events</NavLink>
                <NavLink to="/team" activeClassName="selected">Team</NavLink>
                <NavLink to="/join_tmeit" activeClassName="selected">JOIN</NavLink>
                <a href={"#"}>Login</a>
            </Navigation>
        </HeaderBox>
    )
}

export default Header