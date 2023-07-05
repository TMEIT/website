import styled from "@emotion/styled"; 
import { useState } from "react";
import {Link} from "react-router-dom";
import {Button} from "@mui/material";
import {Grid} from "@mui/material";
import {Box} from "@mui/material";
import Centered from "../components/Centered.js";
import useIsScreenWide from "../useIsScreenWide.js";

import MasterSignups from "../components/MasterSignups";

const StyledMasterMenu = styled(MasterMenu)({
  ".button" : {
      width : "16vw",

  }
});

function MasterMenu() {
  const isScreenWide = useIsScreenWide(950);

  const [menu, setMenu] = useState(0);
  return (
    <>
      <Centered>
        <Grid sx={{justifyContent: "space-around", display: "grid"}}>
          <Box mt={2} mb={2} mx={"Auto"}>
            <Button className="button" variant="contained"><Link to="/migrating">See Pending member migrations</Link></Button>
          </Box>
          <Box mt={2} mb={2} mx={"Auto"}>
            <Button className="button" variant="contained" onClick={() => setMenu(2)}>Signups menu</Button>
          </Box>
          <Box mt={2} mb={2} mx={"Auto"}>
            <Button className="button" variant="contained" onClick={() => setMenu(3)}>Create Event</Button>
          </Box>
          <Box mt={2} mb={2} mx={"Auto"}>
            <Button className="button" variant="contained" onClick={() => setMenu(4)}>Edit/Delete Events</Button>
          </Box>
        </Grid>
      </Centered>
      <div>
        {(() => {
          switch (menu) {
            case 0:
              return <></>;
            case 1:
              return <></>;
            case 2:
              return <MasterSignups></MasterSignups>;
            case 3:
              return <></>;
            case 4:
              return <></>;
            case 5:
              return <></>;
          }
        })()}
      </div>
    </>
  );
}
export default StyledMasterMenu;
