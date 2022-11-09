import "./dropdown.css";
import "./login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GetMyInfo from "./GetMyInfo";

function Dropdown() {
  const [profile, setProfile] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);
  const [master, setMaster] = useState(false);

  let navigate = useNavigate();

  async function goToProfile() {
    let result = await GetMyInfo();
    try {
      let link = result.body.short_uuid;
      navigate("/profile/" + link);
    } catch (error) {
      console.log(error);
      alert("Error, somehow you got no data LMAO");
    }
  }

  async function handleProfile() {
    if (!profile) {
      let result = await GetMyInfo();
      try {
        setMaster(result.body.current_role == "master");
      } catch (error) {
        console.log(error);
      }
    }
    setProfile(!profile);
  }

  function handleLogout() {
    // Sets the cookie to instantly expire and deletes it.
    document.cookie = "access_token=; expires = Thu, 01 Jan 1970 00:00:00 UTC;";
    setOpenLogout(false);
    navigate(0);
  }

  return (
    <>
      <div className="link">
        <a href={"#"} onClick={() => handleProfile()}>
          Settings{" "}
        </a>
        <div className={`menu ${profile ? "open" : ""}`}>
          <button onClick={() => goToProfile()}>My profile</button>
          <button onClick={() => setOpenLogout(true)}>Log out</button>
          {master ? (
            <button onClick={() => navigate("master")}>
              Go to Master menu
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div id="logoutModal">
        {openLogout && (
          <>
            <div className="overlay">
              <div className="modal">
                <header className="modalHeader">
                  <h2>Logout</h2>
                  <button
                    onClick={() => setOpenLogout(false)}
                    className="closeButton"
                  >
                    &times;
                  </button>
                </header>
                <main className="modalMain">
                  <h4>Are you sure you want to log out?</h4>
                  <button onClick={() => handleLogout()}>Yes, I am</button>
                </main>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Dropdown;
