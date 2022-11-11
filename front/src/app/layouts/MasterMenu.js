import { useState } from "react";
import {Link} from "react-router-dom";

import MasterSignups from "../components/MasterSignups";


function MasterMenu() {
  const [menu, setMenu] = useState(0);
  return (
    <>
        <Link to="/migrating">See Pending member migrations</Link>
      <div>
        <button onClick={() => setMenu(1)}>Signups menu</button>
      </div>
      <div>
        {(() => {
          switch (menu) {
            case 0:
              return <></>;
            case 1:
              return <MasterSignups></MasterSignups>;
            case 2:
              return <></>;

            case 3:
              return <></>;
          }
        })()}
      </div>
    </>
  );
}
export default MasterMenu;
