import React from "react";

function Joined() {
  return (
    <div>
      <h1>
        You are now registered to TMEIT! You now have to wait for the masters to
        approve your registration before it will be visible
      </h1>
      <Link to="/">
        <h2>Click here to go back to the home page</h2>
      </Link>
    </div>
  );
}

export default Joined;
