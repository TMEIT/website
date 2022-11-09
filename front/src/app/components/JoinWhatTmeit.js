import React from "react";
import styled from "@emotion/styled";


const StyledJoinWhatTmeit = styled(JoinWhatTmeit)({
    p: {
        textAlign: "justify"
    },
    h2: {
        fontSize: "calc(1.325rem + .9vw)"
    }
});

function JoinWhatTmeit({className}) {
  return (
    <div className={className}>
        <h2>TraditionsMEsterIT</h2>
        <p>
            TMEIT is one of the two klubbmästerier at KTH Kista, and we make up a large amount of the student activity at IN-sektionen.
            As a klubbmästeri, we represent "student overall culture" in Kista,
            and we continue the Swedish tradition of sewing together and wearing student overalls,
            and holding and attending parties at our universities.
        </p>
        <h2>Who we are</h2>
        <p>
            As one of the most active klubbmästerier in Stockholm,
            our members (known as "Marshals") are skilled bartenders and run many of the most popular parties in Kista.
            Our members are well known at student pubs around Stockholm,
            and many of our alumni members can still be found bartending at Nymble or organizing cruises with Sjöslaget.
        </p>
        <h2>What we do</h2>
        <p>
            As a member of TMEIT, you help run Kistan 2.0 during events about once or twice a month,
            you join countless student parties both here in Kista and elsewhere in Stockholm,
            and you join a tight-knit student community with best friends that look out for one-another.
        </p>
    </div>
  )
}

export default StyledJoinWhatTmeit;
