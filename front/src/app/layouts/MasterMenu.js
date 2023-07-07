import { useState } from "react";
import {Link} from "react-router-dom";
import {Button} from "@mui/material";
import {Box} from "@mui/material";
import Centered from "../components/Centered.js";
import useIsScreenWide from "../useIsScreenWide.js";

import MasterSignups from "../components/MasterSignups";

function MasterMenu() {

  let screenWide = useIsScreenWide(949);

  const styles = {
    button :{
      width: "16vw",
      marginTop: "2em",
      marginBottom: "2em",
    },

    buttonMobile:{
      width: "30vw",
      marginTop: "1em",
      marginBottom: "1em",
    }
  };

  const isScreenWide = useIsScreenWide(950);

  const [menu, setMenu] = useState(0);
  return (
    <>
      <Centered>
        <Box mt={2} mb={2} mx={"Auto"} style={{display: "grid", gridAutoFlow: "row"}}>
          <Button style={screenWide? styles.button : styles.buttonMobile} variant="contained"><Link to="/migrating">See Pending member migrations</Link></Button>
        
          <Button style={screenWide? styles.button : styles.buttonMobile} variant="contained" onClick={() => setMenu(2)}>Signups menu</Button>
      
          <Button style={screenWide? styles.button : styles.buttonMobile} variant="contained" onClick={() => setMenu(4)}>Edit/Delete Events - ADMIN</Button>

          <Button hidden={menu==0} style={screenWide? styles.button : styles.buttonMobile} variant="contained" onClick={() => setMenu(0)}>Back</Button>
        </Box>
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
