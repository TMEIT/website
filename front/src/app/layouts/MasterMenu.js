import { Fragment, useState } from "react";
import Loading from "../components/Loading";
import MasterSignups from "../components/MasterSignups";
import { useFetch } from "../FetchHooks";

function MasterMenu() {
  const [menu, setMenu] = useState(0);
  return (
    <>
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
