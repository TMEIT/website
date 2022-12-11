import {NavLink} from "react-router-dom";
import {Button} from "@mui/material";
import styled from "@emotion/styled";

import tmeit_logo_nogojan_mono from "../../logos/LogoTMEIT_withoutGojan_monochrome.svg";
import { kisel_blue, kisel_blue_dark, secondary_purp, secondary_purp_dark, primary_light, accent_yellow } from "../../palette.js";
import MobileHeaderMenu from "./MobileHeaderMenu.js";

export const mobile_header_height = "4rem"

const StyledMobileHeader = styled(MobileHeader)({
    position: "fixed",
    bottom: 0,
    width: "100%",
    height: mobile_header_height,
    display: "grid",
    background: kisel_blue_dark,
    grid: "1fr auto 1fr / 1fr auto 1fr",
    "#logo": {
        height: "3.5rem",
    }
});

function MobileHeader({className, loggedIn, setLoginModalOpen}) {
  return (
          <header className={className}>
              <img css={{gridColumn: 2, gridRow: 2}} id="logo" src={tmeit_logo_nogojan_mono} alt="TMEIT Logo" />
              <MobileHeaderMenu css={{gridColumn: 3, gridRow: 2}} loggedIn={loggedIn} setLoginModalOpen={setLoginModalOpen}/>
          </header>
  );
}

export default StyledMobileHeader;
