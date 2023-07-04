import { useState } from "react";
import {Link} from "react-router-dom";
import {Button} from "@mui/material";
import {Grid} from "@mui/material";
import {Box} from "@mui/material";
import Centered from "../components/Centered.js";

import MasterSignups from "../components/MasterSignups";


function MasterMenu() {
  const [menu, setMenu] = useState(0);
  return (
    <>
      <Centered>
        <Grid sx={{justifyContent: "space-around", display: "grid"}}>
          <Box mt={3} mb={3} mx={"Auto"}>
            <Button variant="contained"><Link to="/migrating">See Pending member migrations</Link></Button>
          </Box>
          <Box mt={3} mb={3} mx={"Auto"}>
            <Button variant="contained" onClick={() => setMenu(2)}>Signups menu</Button>
          </Box>
          <Box mt={3} mb={3} mx={"Auto"}>
            <Button variant="contained" onClick={() => setMenu(3)}>Create Event</Button>
          </Box>
          <Box mt={3} mb={3} mx={"Auto"}>
            <Button variant="contained" onClick={() => setMenu(4)}>Edit/Delete Events</Button>
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
export default MasterMenu;
